import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutThsSectionComponent } from './about-ths-section.component';

describe('AboutThsSectionComponent', () => {
  let component: AboutThsSectionComponent;
  let fixture: ComponentFixture<AboutThsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutThsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutThsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
