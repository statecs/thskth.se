import { TestBed, inject } from '@angular/core/testing';

import { HideUICommunicationService } from './hide-ui-communication.service';

describe('HideUICommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HideUICommunicationService]
    });
  });

  it('should be created', inject([HideUICommunicationService], (service: HideUICommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
