import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentKanbanPage } from './incident-kanban-page';

describe('IncidentKanbanPage', () => {
  let component: IncidentKanbanPage;
  let fixture: ComponentFixture<IncidentKanbanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentKanbanPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentKanbanPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
