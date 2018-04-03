import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsSocialContainerComponent } from './cards-social-container.component';

describe('CardsSocialContainerComponent', () => {
  let component: CardsSocialContainerComponent;
  let fixture: ComponentFixture<CardsSocialContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsSocialContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsSocialContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
