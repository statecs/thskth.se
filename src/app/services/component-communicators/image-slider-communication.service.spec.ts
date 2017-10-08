import { TestBed, inject } from '@angular/core/testing';

import { ImageSliderCommunicationService } from './image-slider-communication.service';

describe('ImageSliderCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageSliderCommunicationService]
    });
  });

  it('should be created', inject([ImageSliderCommunicationService], (service: ImageSliderCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
