import { Component, inject } from '@angular/core';
import { IncidentService } from '../../../incidents/services/incident.service';

@Component({
  imports: [],
  selector: 'app-command-center-page',
  styleUrl: './command-center-page.scss',
  templateUrl: './command-center-page.html',
})
export class CommandCenterPage {
  private readonly IncidentService = inject(IncidentService);

  //readonly singal refrences from the service
  readonly totalIncidents = this.IncidentService.totalIncidents;
  readonly criticalIncidents = this.IncidentService.criticalIncidents;
  readonly openIncidents = this.IncidentService.openIncidents;
  readonly resolvedIncidents = this.IncidentService.closedIncident;
}
