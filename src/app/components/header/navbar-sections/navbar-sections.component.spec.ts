import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSectionsComponent } from './navbar-sections.component';

describe('NavbarSectionsComponent', () => {
  let component: NavbarSectionsComponent;
  let fixture: ComponentFixture<NavbarSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
