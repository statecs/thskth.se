import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextGalleryComponent } from './text-gallery.component';

describe('TextGalleryComponent', () => {
  let component: TextGalleryComponent;
  let fixture: ComponentFixture<TextGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
