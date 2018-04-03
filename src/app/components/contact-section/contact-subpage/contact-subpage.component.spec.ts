import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSubpageComponent } from './contact-subpage.component';

describe('ContactSubpageComponent', () => {
  let component: ContactSubpageComponent;
  let fixture: ComponentFixture<ContactSubpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSubpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
