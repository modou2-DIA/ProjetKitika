import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationGroupeeComponent } from './reservation-groupee.component';

describe('ReservationGroupeeComponent', () => {
  let component: ReservationGroupeeComponent;
  let fixture: ComponentFixture<ReservationGroupeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationGroupeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationGroupeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
