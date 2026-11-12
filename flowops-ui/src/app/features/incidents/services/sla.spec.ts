import { TestBed } from '@angular/core/testing';
import { Sla } from './sla';

describe('Sla', () => {
  let service: Sla;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sla);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
