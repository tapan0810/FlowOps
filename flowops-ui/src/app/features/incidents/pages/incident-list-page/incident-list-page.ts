import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { IncidentService } from '../../services/incident.service';

import type {
  Incident,
  IncidentSeverity,
  IncidentStatus
} from '../../models/incident.model';
import { DatePipe } from '@angular/common';

type SortOption =
  | 'newest'
  | 'oldest'
  | 'title'
  | 'severity';

@Component({
  selector: 'app-incident-list-page',
  imports: [RouterLink,DatePipe],
  templateUrl: './incident-list-page.html',
  styleUrl: './incident-list-page.scss'
})
export class IncidentListPage {

  private readonly incidentService =
    inject(IncidentService);

  readonly incidents =
    this.incidentService.incidents;

  readonly searchTerm = signal('');

  readonly selectedSeverity =
    signal<IncidentSeverity | 'All'>('All');

  readonly selectedStatus =
    signal<IncidentStatus | 'All'>('All');

  readonly sortBy = signal<SortOption>('newest');

  readonly currentPage = signal(1);

  readonly pageSize = 5;

  readonly filteredIncidents = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    const severity = this.selectedSeverity();
    const status = this.selectedStatus();

    let result = this.incidents().filter(incident => {

      const matchesSearch =
        !search ||
        incident.id.toLowerCase().includes(search) ||
        incident.title.toLowerCase().includes(search) ||
        incident.serviceName.toLowerCase().includes(search);

      const matchesSeverity =
        severity === 'All' ||
        incident.severity === severity;

      const matchesStatus =
        status === 'All' ||
        incident.status === status;

      return matchesSearch &&
        matchesSeverity &&
        matchesStatus;
    });

    result = [...result];

    switch (this.sortBy()) {

      case 'newest':
        result.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
        break;

      case 'oldest':
        result.sort((a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
        break;

      case 'title':
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case 'severity': {
        const priority: Record<IncidentSeverity, number> = {
          Critical: 1,
          High: 2,
          Medium: 3,
          Low: 4
        };

        result.sort((a, b) =>
          priority[a.severity] - priority[b.severity]
        );
        break;
      }
    }

    return result;
  });

  readonly totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.filteredIncidents().length / this.pageSize
      )
    )
  );

  readonly paginatedIncidents = computed(() => {

    const start =
      (this.currentPage() - 1) * this.pageSize;

    return this.filteredIncidents().slice(
      start,
      start + this.pageSize
    );
  });

  setSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setSeverity(value: string): void {
    this.selectedSeverity.set(
      value as IncidentSeverity | 'All'
    );
    this.currentPage.set(1);
  }

  setStatus(value: string): void {
    this.selectedStatus.set(
      value as IncidentStatus | 'All'
    );
    this.currentPage.set(1);
  }

  setSort(value: string): void {
    this.sortBy.set(value as SortOption);
    this.currentPage.set(1);
  }

  previousPage(): void {
    this.currentPage.update(page =>
      Math.max(1, page - 1)
    );
  }

  nextPage(): void {
    this.currentPage.update(page =>
      Math.min(this.totalPages(), page + 1)
    );
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedSeverity.set('All');
    this.selectedStatus.set('All');
    this.sortBy.set('newest');
    this.currentPage.set(1);
  }
}