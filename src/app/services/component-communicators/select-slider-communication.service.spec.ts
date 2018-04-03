import { TestBed, inject } from '@angular/core/testing';

import { SelectSliderCommunicationService } from './select-slider-communication.service';

describe('SelectSliderCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectSliderCommunicationService]
    });
  });

  it('should be created', inject([SelectSliderCommunicationService], (service: SelectSliderCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
