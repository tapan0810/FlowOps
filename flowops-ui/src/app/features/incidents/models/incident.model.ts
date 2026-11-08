export type IncidentSeverity=
|'Critical'
|'High'
|'Medium'
|'Low';

export type IncidentStatus = 
|'New'
|'Triaged'
|'Assigned'
|'Investigating'
|'Mitigated'
|'Resolved'
|'Closed';

export interface Incident{
    id:string;
    title:string;
    description:string;

    severity:IncidentSeverity;
    status:IncidentStatus;

    serviceName:string;
    assignedTo:string;

    createdAt:string;
    slaTargetMinutes:number;


}