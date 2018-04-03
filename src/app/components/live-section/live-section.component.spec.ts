import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSectionComponent } from './live-section.component';

describe('LiveSectionComponent', () => {
  let component: LiveSectionComponent;
  let fixture: ComponentFixture<LiveSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
