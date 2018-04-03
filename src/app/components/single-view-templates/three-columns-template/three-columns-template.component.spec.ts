import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeColumnsTemplateComponent } from './three-columns-template.component';

describe('ThreeColumnsTemplateComponent', () => {
  let component: ThreeColumnsTemplateComponent;
  let fixture: ComponentFixture<ThreeColumnsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeColumnsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeColumnsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
