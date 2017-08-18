import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderSecondaryComponent } from './image-slider-secondary.component';

describe('ImageSliderSecondaryComponent', () => {
  let component: ImageSliderSecondaryComponent;
  let fixture: ComponentFixture<ImageSliderSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSliderSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSliderSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
