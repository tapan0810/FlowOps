import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentDetailsPage } from './incident-details-page';

describe('IncidentDetailsPage', () => {
  let component: IncidentDetailsPage;
  let fixture: ComponentFixture<IncidentDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
