import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimarySliderComponent } from './primary-slider.component';

describe('PrimarySliderComponent', () => {
  let component: PrimarySliderComponent;
  let fixture: ComponentFixture<PrimarySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimarySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimarySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
