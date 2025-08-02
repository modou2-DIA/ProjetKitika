import { TestBed } from '@angular/core/testing';

import { ReservationGroupeeService } from './reservation-groupee.service';

describe('ReservationGroupeeService', () => {
  let service: ReservationGroupeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationGroupeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
