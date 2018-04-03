import { TestBed, inject } from '@angular/core/testing';

import { CalendarCommunicationService } from './calendar-communication.service';

describe('CalendarCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarCommunicationService]
    });
  });

  it('should be created', inject([CalendarCommunicationService], (service: CalendarCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
