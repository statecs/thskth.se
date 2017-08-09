import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneColumnTemplateComponent } from './one-column-template.component';

describe('OneColumnTemplateComponent', () => {
  let component: OneColumnTemplateComponent;
  let fixture: ComponentFixture<OneColumnTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneColumnTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneColumnTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
