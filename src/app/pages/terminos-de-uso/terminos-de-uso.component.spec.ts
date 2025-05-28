import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosDeUsoComponent } from './terminos-de-uso.component';

describe('TerminosDeUsoComponent', () => {
  let component: TerminosDeUsoComponent;
  let fixture: ComponentFixture<TerminosDeUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosDeUsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosDeUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
