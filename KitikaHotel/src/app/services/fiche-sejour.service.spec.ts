import { TestBed } from '@angular/core/testing';

import { FicheSejourService } from './fiche-sejour.service';

describe('FicheSejourService', () => {
  let service: FicheSejourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheSejourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
