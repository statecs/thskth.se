import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderMessageComponent } from './loader-message.component';

describe('LoaderMessageComponent', () => {
  let component: LoaderMessageComponent;
  let fixture: ComponentFixture<LoaderMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
