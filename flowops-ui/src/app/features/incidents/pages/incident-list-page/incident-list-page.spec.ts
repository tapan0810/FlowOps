import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentListPage } from './incident-list-page';

describe('IncidentListPage', () => {
  let component: IncidentListPage;
  let fixture: ComponentFixture<IncidentListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
