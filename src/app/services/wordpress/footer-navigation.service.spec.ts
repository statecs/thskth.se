import { TestBed, inject } from '@angular/core/testing';

import { FooterNavigationService } from './footer-navigation.service';

describe('FooterNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FooterNavigationService]
    });
  });

  it('should be created', inject([FooterNavigationService], (service: FooterNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
