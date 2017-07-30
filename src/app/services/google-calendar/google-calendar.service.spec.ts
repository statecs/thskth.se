import { TestBed, inject } from '@angular/core/testing';

import { GoogleCalendarService } from './google-calendar.service';

describe('GoogleCalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleCalendarService]
    });
  });

  it('should be created', inject([GoogleCalendarService], (service: GoogleCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
