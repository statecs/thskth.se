import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCategorizerComponent } from './card-categorizer.component';

describe('CardCategorizerComponent', () => {
  let component: CardCategorizerComponent;
  let fixture: ComponentFixture<CardCategorizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardCategorizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCategorizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
