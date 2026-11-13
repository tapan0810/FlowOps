
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SlaService } from '../../services/sla';

import type { IncidentStatus } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-details-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './incident-details-page.html',
  styleUrl: './incident-details-page.scss'
})
export class IncidentDetailsPage {

  // ==========================================
  // 1. DEPENDENCY INJECTION
  // ==========================================

  private readonly route = inject(ActivatedRoute);
  private readonly incidentService = inject(IncidentService);
  private readonly slaService = inject(SlaService);


  // ==========================================
  // 2. ROUTE PARAMETERS
  // ==========================================

  private readonly routeParams = toSignal(
    this.route.paramMap,
    {
      initialValue: this.route.snapshot.paramMap
    }
  );


  // ==========================================
  // 3. SELECTED INCIDENT
  // ==========================================

  readonly incident = computed(() => {

    const id = this.routeParams().get('id');

    if (!id) {
      return null;
    }

    return this.incidentService.incidents().find(
      item => item.id === id
    ) ?? null;

  });


  // ==========================================
  // 4. INCIDENT LIFECYCLE MANAGEMENT
  // ==========================================

  readonly availableTransitions = computed(() => {

    const current = this.incident();

    return current
      ? this.incidentService.getAllowedTransitions(current.status)
      : [];

  });


  // Change incident status
  changeStatus(nextStatus: IncidentStatus): void {
  const current = this.incident();

  if (!current) {
    return;
  }

  this.incidentService
    .transitionIncident(
      current.id,
      nextStatus,
      'Current User'
    )
    .subscribe(success => {
      if (!success) {
        window.alert(
          'Unable to update incident status. Please try again.'
        );
      }
    });
} 


  // ==========================================
  // 5. ENGINEER ASSIGNMENT
  // ==========================================

  readonly selectedEngineer = signal('');

 assignEngineer(event: Event): void {
  const current = this.incident();

  if (!current) {
    return;
  }

  const engineer = (event.target as HTMLSelectElement).value;

  if (!engineer) {
    return;
  }

  this.incidentService
    .assignIncident(
      current.id,
      engineer,
      'Current User'
    )
    .subscribe(success => {

      if (success) {
        this.selectedEngineer.set('');
      } else {
        window.alert(
          'Unable to assign this engineer. Please try again.'
        );
      }

    });
}


  // ==========================================
  // 6. ACTIVITY HISTORY
  // ==========================================

  readonly activities = computed(() => {

    const current = this.incident();

    return current
      ? this.incidentService.activities().filter(
          activity => activity.incidentId === current.id
        )
      : [];

  });


  // ==========================================
  // 7. COMMENT MANAGEMENT
  // ==========================================

  // Stores the comment currently being typed
  readonly commentText = signal('');


  // Displays comments for the selected incident
  readonly comments = computed(() => {

    const current = this.incident();

    if (!current) {
      return [];
    }

    return this.incidentService.comments().filter(
      comment => comment.incidentId === current.id
    );

  });


  // Handles textarea input
  onCommentInput(event: Event): void {

    const textarea = event.target as HTMLTextAreaElement;

    this.commentText.set(textarea.value);

  }


  // Submits a new comment
  submitComment(): void {

    const current = this.incident();

    if (!current) {
      return;
    }

    const message = this.commentText().trim();

    if (!message) {
      return;
    }

    const success = this.incidentService.addComment(
      current.id,
      message,
      'Current User'
    );

    if (success) {

      // Clear the comment input after successful submission
      this.commentText.set('');

    }

  }

  // ==========================================
// SLA MANAGEMENT
// ==========================================

readonly slaMetrics = computed(() => {
  const current = this.incident();

  if (!current) {
    return null;
  }

  return this.slaService.calculateMetrics(current);
});

}
