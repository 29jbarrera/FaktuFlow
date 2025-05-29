import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejosFinancierosComponent } from './consejos-financieros.component';

describe('ConsejosFinancierosComponent', () => {
  let component: ConsejosFinancierosComponent;
  let fixture: ComponentFixture<ConsejosFinancierosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsejosFinancierosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsejosFinancierosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
