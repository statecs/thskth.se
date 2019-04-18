import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoaderHomeComponent } from "./loader-home.component";

describe("LoaderComponent", () => {
  let component: LoaderHomeComponent;
  let fixture: ComponentFixture<LoaderHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
