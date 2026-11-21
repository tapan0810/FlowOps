import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { IncidentApiService } from './incident-api';

describe('IncidentApiService', () => {
  let service: IncidentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });

    service = TestBed.inject(IncidentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
