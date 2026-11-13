import { TestBed } from '@angular/core/testing';
import { WorkflowEngine } from './workflow-engine';

describe('WorkflowEngine', () => {
  let service: WorkflowEngine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowEngine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
