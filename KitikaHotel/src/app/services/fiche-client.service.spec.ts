import { TestBed } from '@angular/core/testing';

import { FicheClientService } from './fiche-client.service';

describe('FicheClientService', () => {
  let service: FicheClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
