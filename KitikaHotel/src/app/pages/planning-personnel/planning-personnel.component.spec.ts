import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPersonnelComponent } from './planning-personnel.component';

describe('PlanningPersonnelComponent', () => {
  let component: PlanningPersonnelComponent;
  let fixture: ComponentFixture<PlanningPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningPersonnelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
