import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationRestoComponent } from './facturation-resto.component';

describe('FacturationRestoComponent', () => {
  let component: FacturationRestoComponent;
  let fixture: ComponentFixture<FacturationRestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturationRestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturationRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
