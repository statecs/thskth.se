import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedLinksComponent } from './related-links.component';

describe('RelatedLinksComponent', () => {
  let component: RelatedLinksComponent;
  let fixture: ComponentFixture<RelatedLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
