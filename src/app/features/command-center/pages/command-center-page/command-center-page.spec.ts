import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandCenterPage } from './command-center-page';

describe('CommandCenterPage', () => {
  let component: CommandCenterPage;
  let fixture: ComponentFixture<CommandCenterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandCenterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandCenterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
