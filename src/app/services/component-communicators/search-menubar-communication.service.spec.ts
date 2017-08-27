import { TestBed, inject } from '@angular/core/testing';

import { SearchMenubarCommunicationService } from './search-menubar-communication.service';

describe('SearchMenubarCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchMenubarCommunicationService]
    });
  });

  it('should be created', inject([SearchMenubarCommunicationService], (service: SearchMenubarCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
