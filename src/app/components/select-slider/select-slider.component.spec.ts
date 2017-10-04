import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSliderComponent } from './select-slider.component';

describe('SelectSliderComponent', () => {
  let component: SelectSliderComponent;
  let fixture: ComponentFixture<SelectSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
