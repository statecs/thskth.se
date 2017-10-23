import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundImageComponent } from './page-not-found-image.component';

describe('PageNotFoundImageComponent', () => {
  let component: PageNotFoundImageComponent;
  let fixture: ComponentFixture<PageNotFoundImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotFoundImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
