import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsommationAnnexeFormComponent } from './consommation-annexe-form.component';

describe('ConsommationAnnexeFormComponent', () => {
  let component: ConsommationAnnexeFormComponent;
  let fixture: ComponentFixture<ConsommationAnnexeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsommationAnnexeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsommationAnnexeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
