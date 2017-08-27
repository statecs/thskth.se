import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLifeSectionComponent } from './student-life-section.component';

describe('StudentLifeSectionComponent', () => {
  let component: StudentLifeSectionComponent;
  let fixture: ComponentFixture<StudentLifeSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLifeSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLifeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
