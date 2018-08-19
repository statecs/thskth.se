import { TestBed, inject } from '@angular/core/testing';

import { SectionNavigationService } from './section-navigation.service';

describe('SectionNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionNavigationService]
    });
  });

  it('should be created', inject([SectionNavigationService], (service: SectionNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
