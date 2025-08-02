import { TestBed } from '@angular/core/testing';

import { ConsommationService } from './consommation.service';

describe('ConsommationService', () => {
  let service: ConsommationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsommationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
