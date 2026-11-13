import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import type {
  IncidentActivity
} from '../models/incident-activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/activities';

  getActivities(): Observable<IncidentActivity[]> {
    return this.http.get<IncidentActivity[]>(
      this.apiUrl
    );
  }

  createActivity(
    activity: IncidentActivity
  ): Observable<IncidentActivity> {

    return this.http.post<IncidentActivity>(
      this.apiUrl,
      activity
    );
  }
}