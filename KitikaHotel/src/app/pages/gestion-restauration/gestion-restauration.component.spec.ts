import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRestaurationComponent } from './gestion-restauration.component';

describe('GestionRestaurationComponent', () => {
  let component: GestionRestaurationComponent;
  let fixture: ComponentFixture<GestionRestaurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRestaurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRestaurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
