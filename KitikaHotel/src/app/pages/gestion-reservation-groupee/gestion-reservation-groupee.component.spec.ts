import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReservationGroupeeComponent } from './gestion-reservation-groupee.component';

describe('GestionReservationGroupeeComponent', () => {
  let component: GestionReservationGroupeeComponent;
  let fixture: ComponentFixture<GestionReservationGroupeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionReservationGroupeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionReservationGroupeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
