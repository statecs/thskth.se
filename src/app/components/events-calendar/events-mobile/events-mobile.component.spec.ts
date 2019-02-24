import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMobileComponent } from './events-mobile.component';

describe('EventsMobileComponent', () => {
  let component: EventsMobileComponent;
  let fixture: ComponentFixture<EventsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
