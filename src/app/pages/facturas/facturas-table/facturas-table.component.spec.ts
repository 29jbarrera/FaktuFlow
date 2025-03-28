import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasTableComponent } from './facturas-table.component';

describe('FacturasTableComponent', () => {
  let component: FacturasTableComponent;
  let fixture: ComponentFixture<FacturasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
