import { TestBed, inject } from '@angular/core/testing';

import { AppCommunicationService } from './app-communication.service';

describe('AppCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppCommunicationService]
    });
  });

  it('should be created', inject([AppCommunicationService], (service: AppCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
