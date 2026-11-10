import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../services/incident.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-incident-details-page',
  styleUrl: './incident-details-page.scss',
  templateUrl: './incident-details-page.html',
})
export class IncidentDetailsPage {

  private readonly route = inject(ActivatedRoute);
  private readonly incidentService = inject(IncidentService);

  //Convert the route's Observable parameter map into a signal
  private readonly routeParams = toSignal(
    this.route.paramMap,
    {initialValue: this.route.snapshot.paramMap}
  );

  //Find the incident matching the route ID
  readonly incident = computed(()=>{
    const id = this.routeParams().get('id');

    if(!id){
      return null;
    }

    return this.incidentService.incidents()
      .find(incident => incident.id === id)?? null;
  })
}
