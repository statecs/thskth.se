import { TestBed, inject } from '@angular/core/testing';

import { PrimarySlidesService } from './primary-slides.service';

describe('PrimarySlidesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrimarySlidesService]
    });
  });

  it('should be created', inject([PrimarySlidesService], (service: PrimarySlidesService) => {
    expect(service).toBeTruthy();
  }));
});
