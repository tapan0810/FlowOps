
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import type { IncidentStatus } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-details-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './incident-details-page.html',
  styleUrl: './incident-details-page.scss'
})
export class IncidentDetailsPage {

  // Dependencies
  private readonly route = inject(ActivatedRoute);
  private readonly incidentService = inject(IncidentService);

  // Route parameter
  private readonly routeParams = toSignal(
    this.route.paramMap,
    { initialValue: this.route.snapshot.paramMap }
  );

  // Selected incident
  readonly incident = computed(() => {
    const id = this.routeParams().get('id');

    if (!id) {
      return null;
    }

    return this.incidentService.incidents()
      .find(item => item.id === id) ?? null;
  });

  // Available next statuses
  readonly availableTransitions = computed(() => {
    const current = this.incident();

    return current
      ? this.incidentService.getAllowedTransitions(current.status)
      : [];
  });

  // Activity history for this incident
  readonly activities = computed(() => {
    const current = this.incident();

    return current
      ? this.incidentService.activities().filter(
          activity => activity.incidentId === current.id
        )
      : [];
  });

  // Engineer selection
  readonly selectedEngineer = signal('');

  // Change incident status
  changeStatus(nextStatus: IncidentStatus): void {
    const current = this.incident();

    if (!current) {
      return;
    }

    const success = this.incidentService.transitionIncident(
      current.id,
      nextStatus,
      'Current User'
    );

    if (!success) {
      window.alert('This status transition is not allowed.');
    }
  }

  // Assign engineer
  assignEngineer(event: Event): void {
    const current = this.incident();

    if (!current) {
      return;
    }

    const engineer = (event.target as HTMLSelectElement).value;

    if (!engineer) {
      return;
    }

    const success = this.incidentService.assignIncident(
      current.id,
      engineer,
      'Current User'
    );

    if (success) {
      this.selectedEngineer.set('');
    } else {
      window.alert('Unable to assign this engineer.');
    }
  }
}
