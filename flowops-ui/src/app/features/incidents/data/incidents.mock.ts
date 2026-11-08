import { Incident } from '../models/incident.model';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-1001',
    title: 'Payment gateway unavailable',
    description: 'Payment processing requests are failing.',
    severity: 'Critical',
    status: 'Investigating',
    serviceName: 'Payment Gateway',
    assignedTo: 'Rahul Sharma',
    createdAt: '2026-11-07T08:30:00',
    slaTargetMinutes: 30
  },
  {
    id: 'INC-1002',
    title: 'Customer portal latency',
    description: 'Users are experiencing slow page loads.',
    severity: 'High',
    status: 'Assigned',
    serviceName: 'Customer Portal',
    assignedTo: 'Priya Singh',
    createdAt: '2026-11-07T09:10:00',
    slaTargetMinutes: 60
  },
  {
    id: 'INC-1003',
    title: 'Database connection pool exhausted',
    description: 'API requests are timing out.',
    severity: 'Critical',
    status: 'Triaged',
    serviceName: 'Customer Database',
    assignedTo: 'Amit Verma',
    createdAt: '2026-11-07T09:25:00',
    slaTargetMinutes: 30
  },
  {
    id: 'INC-1004',
    title: 'Email notification delay',
    description: 'Outbound notifications are delayed.',
    severity: 'Medium',
    status: 'Investigating',
    serviceName: 'Notification Service',
    assignedTo: 'Neha Das',
    createdAt: '2026-11-07T10:00:00',
    slaTargetMinutes: 240
  },
  {
    id: 'INC-1005',
    title: 'Report export failure',
    description: 'CSV export fails for large reports.',
    severity: 'Low',
    status: 'New',
    serviceName: 'Reporting Service',
    assignedTo: 'Unassigned',
    createdAt: '2026-11-07T10:30:00',
    slaTargetMinutes: 480
  }
];