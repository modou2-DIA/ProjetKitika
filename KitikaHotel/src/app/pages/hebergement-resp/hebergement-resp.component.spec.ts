import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HebergementRespComponent } from './hebergement-resp.component';

describe('HebergementRespComponent', () => {
  let component: HebergementRespComponent;
  let fixture: ComponentFixture<HebergementRespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HebergementRespComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HebergementRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
