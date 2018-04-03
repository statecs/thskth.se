import { TestBed, inject } from '@angular/core/testing';

import { TextSliderCommunicationService } from './text-slider-communication.service';

describe('TextSliderCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextSliderCommunicationService]
    });
  });

  it('should be created', inject([TextSliderCommunicationService], (service: TextSliderCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
