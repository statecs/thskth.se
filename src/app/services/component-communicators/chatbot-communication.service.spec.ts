import { TestBed, inject } from '@angular/core/testing';

import { ChatbotCommunicationService } from './chatbot-communication.service';

describe('ChatbotCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatbotCommunicationService]
    });
  });

  it('should be created', inject([ChatbotCommunicationService], (service: ChatbotCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
