import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFeedbackComponent } from './dialog-feedback.component';

describe('DialogFeedbackComponent', () => {
  let component: DialogFeedbackComponent;
  let fixture: ComponentFixture<DialogFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
