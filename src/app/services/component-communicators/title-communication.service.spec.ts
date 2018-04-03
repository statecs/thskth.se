import { TestBed, inject } from '@angular/core/testing';

import { TitleCommunicationService } from './title-communication.service';

describe('TitleCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleCommunicationService]
    });
  });

  it('should be created', inject([TitleCommunicationService], (service: TitleCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
