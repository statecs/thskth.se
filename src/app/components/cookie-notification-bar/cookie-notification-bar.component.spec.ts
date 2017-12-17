import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieNotificationBarComponent } from './cookie-notification-bar.component';

describe('CookieNotificationBarComponent', () => {
  let component: CookieNotificationBarComponent;
  let fixture: ComponentFixture<CookieNotificationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieNotificationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieNotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
