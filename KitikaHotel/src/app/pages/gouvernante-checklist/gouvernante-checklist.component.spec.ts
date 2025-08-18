import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GouvernanteChecklistComponent } from './gouvernante-checklist.component';

describe('GouvernanteChecklistComponent', () => {
  let component: GouvernanteChecklistComponent;
  let fixture: ComponentFixture<GouvernanteChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GouvernanteChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GouvernanteChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
