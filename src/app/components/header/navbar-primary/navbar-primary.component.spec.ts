import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPrimaryComponent } from './navbar-primary.component';

describe('NavbarPrimaryComponent', () => {
  let component: NavbarPrimaryComponent;
  let fixture: ComponentFixture<NavbarPrimaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarPrimaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
