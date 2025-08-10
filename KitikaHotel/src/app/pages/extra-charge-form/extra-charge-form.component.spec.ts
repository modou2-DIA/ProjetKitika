import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraChargeFormComponent } from './extra-charge-form.component';

describe('ExtraChargeFormComponent', () => {
  let component: ExtraChargeFormComponent;
  let fixture: ComponentFixture<ExtraChargeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraChargeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraChargeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
