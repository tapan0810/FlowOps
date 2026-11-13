import { TestBed } from '@angular/core/testing';
import { ActivityApi } from './activity-api';

describe('ActivityApi', () => {
  let service: ActivityApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
