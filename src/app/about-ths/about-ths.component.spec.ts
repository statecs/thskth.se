import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutThsComponent } from './about-ths.component';

describe('AboutThsComponent', () => {
  let component: AboutThsComponent;
  let fixture: ComponentFixture<AboutThsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutThsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutThsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
