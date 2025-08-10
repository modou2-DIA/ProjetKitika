import { TestBed } from '@angular/core/testing';

import { ExtraChargeService } from './extra-charge.service';

describe('ExtraChargeService', () => {
  let service: ExtraChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
