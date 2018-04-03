import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSliderComponent } from './header-slider.component';

describe('HeaderSliderComponent', () => {
  let component: HeaderSliderComponent;
  let fixture: ComponentFixture<HeaderSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
