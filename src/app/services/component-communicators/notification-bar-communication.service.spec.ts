import { TestBed, inject } from '@angular/core/testing';

import { NotificationBarCommunicationService } from './notification-bar-communication.service';

describe('NotificationBarCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationBarCommunicationService]
    });
  });

  it('should be created', inject([NotificationBarCommunicationService], (service: NotificationBarCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
