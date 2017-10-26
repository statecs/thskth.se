import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedFaqsComponent } from './featured-faqs.component';

describe('FeaturedFaqsComponent', () => {
  let component: FeaturedFaqsComponent;
  let fixture: ComponentFixture<FeaturedFaqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedFaqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
