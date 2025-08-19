import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCuisineComponent } from './stock-cuisine.component';

describe('StockCuisineComponent', () => {
  let component: StockCuisineComponent;
  let fixture: ComponentFixture<StockCuisineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCuisineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCuisineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
