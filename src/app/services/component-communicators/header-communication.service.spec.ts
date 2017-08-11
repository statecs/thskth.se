import { TestBed, inject } from '@angular/core/testing';

import { HeaderCommunicationService } from './header-communication.service';

describe('HeaderCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderCommunicationService]
    });
  });

  it('should be created', inject([HeaderCommunicationService], (service: HeaderCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
