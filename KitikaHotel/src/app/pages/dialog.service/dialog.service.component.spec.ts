import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogServiceComponent } from './dialog.service.component';

describe('DialogServiceComponent', () => {
  let component: DialogServiceComponent;
  let fixture: ComponentFixture<DialogServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
