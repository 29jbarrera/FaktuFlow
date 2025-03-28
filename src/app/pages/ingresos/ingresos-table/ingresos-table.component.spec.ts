import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosTableComponent } from './ingresos-table.component';

describe('IngresosTableComponent', () => {
  let component: IngresosTableComponent;
  let fixture: ComponentFixture<IngresosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
