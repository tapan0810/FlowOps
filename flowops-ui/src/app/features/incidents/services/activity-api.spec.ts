import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivityApiService } from './activity-api';

describe('ActivityApiService', () => {
  let service: ActivityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });

    service = TestBed.inject(ActivityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
