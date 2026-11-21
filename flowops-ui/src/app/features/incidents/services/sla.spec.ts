import { TestBed } from '@angular/core/testing';
import { SlaService } from './sla';

describe('SlaService', () => {
  let service: SlaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(SlaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
