import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaptersAssociationsComponent } from './chapters-associations.component';

describe('ChaptersAssociationsComponent', () => {
  let component: ChaptersAssociationsComponent;
  let fixture: ComponentFixture<ChaptersAssociationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaptersAssociationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaptersAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
