import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBlogsComponent } from './nav-blogs.component';

describe('NavBlogsComponent', () => {
  let component: NavBlogsComponent;
  let fixture: ComponentFixture<NavBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
