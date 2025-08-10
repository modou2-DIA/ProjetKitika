import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionChambresComponent } from './gestion-chambres.component';

describe('GestionChambresComponent', () => {
  let component: GestionChambresComponent;
  let fixture: ComponentFixture<GestionChambresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionChambresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionChambresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
