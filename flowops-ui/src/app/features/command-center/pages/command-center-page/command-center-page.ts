
import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IncidentService } from '../../../incidents/services/incident.service';
import {
  IncidentSeverity,
  IncidentStatus
} from '../../../incidents/models/incident.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-command-center-page',
  imports: [DatePipe,RouterLink],
  templateUrl: './command-center-page.html',
  styleUrl: './command-center-page.scss'
})
export class CommandCenterPage {

  private readonly incidentService = inject(IncidentService);

  // Incident data and KPI values
  readonly incidents = this.incidentService.incidents;

  readonly totalIncidents = this.incidentService.totalIncidents;
  readonly criticalIncidents = this.incidentService.criticalIncidents;
  readonly openIncidents = this.incidentService.openIncidents;
  readonly resolvedIncidents = this.incidentService.closedIncident;

  // UI state
  readonly searchTerm = signal('');

  readonly selectedSeverity = signal<IncidentSeverity | 'All'>('All');

  readonly selectedStatus = signal<IncidentStatus | 'All'>('All');

  readonly sortOrder = signal<'newest' | 'oldest'>('newest');

  // Derived incident collection
  readonly filteredIncidents = computed(() => {

    const search = this.searchTerm().trim().toLowerCase();
    const severity = this.selectedSeverity();
    const status = this.selectedStatus();

    const filtered = this.incidents().filter(incident => {

      const matchesSearch =
        incident.id.toLowerCase().includes(search) ||
        incident.title.toLowerCase().includes(search) ||
        incident.serviceName.toLowerCase().includes(search);

      const matchesSeverity =
        severity === 'All' || incident.severity === severity;

      const matchesStatus =
        status === 'All' || incident.status === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });

    // Sort a copy; never mutate the original incident collection.
    return [...filtered].sort((a, b) => {

      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return this.sortOrder() === 'newest'
        ? dateB - dateA
        : dateA - dateB;
    });
  });

  // Input event handlers
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onSeverityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSeverity.set(value as IncidentSeverity | 'All');
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus.set(value as IncidentStatus | 'All');
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOrder.set(value as 'newest' | 'oldest');
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedSeverity.set('All');
    this.selectedStatus.set('All');
    this.sortOrder.set('newest');
  }
}
