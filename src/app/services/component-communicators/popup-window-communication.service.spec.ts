import { TestBed, inject } from '@angular/core/testing';

import { PopupWindowCommunicationService } from './popup-window-communication.service';

describe('PopupWindowCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupWindowCommunicationService]
    });
  });

  it('should ...', inject([PopupWindowCommunicationService], (service: PopupWindowCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
