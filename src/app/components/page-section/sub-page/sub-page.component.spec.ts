import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLifeComponent } from './sub-page.component';

describe('StudentLifeComponent', () => {
  let component: StudentLifeComponent;
  let fixture: ComponentFixture<StudentLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
