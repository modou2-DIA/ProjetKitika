import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheSejourComponent } from './fiche-sejour.component';

describe('FicheSejourComponent', () => {
  let component: FicheSejourComponent;
  let fixture: ComponentFixture<FicheSejourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheSejourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FicheSejourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
