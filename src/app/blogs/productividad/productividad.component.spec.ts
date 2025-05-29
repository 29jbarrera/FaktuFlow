import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductividadComponent } from './productividad.component';

describe('ProductividadComponent', () => {
  let component: ProductividadComponent;
  let fixture: ComponentFixture<ProductividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductividadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
