
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { Incident } from '../models/incident.model';
import { IncidentComment } from '../models/incident-comment.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentApiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/incidents';

  // GET: Retrieve all incidents
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  // GET: Retrieve one incident by ID
  getIncidentById(id: string): Observable<Incident> {
    return this.http.get<Incident>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  // POST: Create an incident
  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(
      this.apiUrl,
      incident
    );
  }

  // PATCH: Update selected incident fields
  updateIncident(
    id: string,
    changes: Partial<Incident>
  ): Observable<Incident> {
    return this.http.patch<Incident>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      changes
    );
  }

  // DELETE: Remove an incident
  deleteIncident(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  getComments(): Observable<IncidentComment[]> {
  return this.http.get<IncidentComment[]>(
    'http://localhost:3000/comments'
  );
}

createComment(
  comment: IncidentComment
): Observable<IncidentComment> {
  return this.http.post<IncidentComment>(
    'http://localhost:3000/comments',
    comment
  );
}
}
