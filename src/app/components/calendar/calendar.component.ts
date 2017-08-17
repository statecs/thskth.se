import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import addDays from 'date-fns/add_days/index';
import isSameMonth from 'date-fns/is_same_month/index';
import isSameDay from 'date-fns/is_same_day/index';
import startOfMonth from 'date-fns/start_of_month/index';
import endOfMonth from 'date-fns/end_of_month/index';
import startOfWeek from 'date-fns/start_of_week/index';
import endOfWeek from 'date-fns/end_of_week/index';
import startOfDay from 'date-fns/start_of_day/index';
import endOfDay from 'date-fns/end_of_day/index';
import format from 'date-fns/format/index';

import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { colors } from '../../utils/colors';
import { Observable } from 'rxjs/Observable';

import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { CalendarCommunicationService } from '../../services/component-communicators/calendar-communication.service';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces/event';
import { ths_calendars } from '../../utils/ths-calendars';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  view: string;
  viewDate: Date;
  events$: Observable<Array<CalendarEvent<{ event: Event }>>>;
  activeDayIsOpen: boolean;
  public ths_calendars: any[];

  constructor(private googleCalendarService: GoogleCalendarService,
              private calendarCommunicationService: CalendarCommunicationService,
              private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.view = 'month';
    this.activeDayIsOpen = false;
    this.viewDate = new Date();
    this.ths_calendars = ths_calendars;
  }

  fetchEvents(): void {
    this.events$ = this.googleCalendarService.fetchEvents(this.ths_calendars[0].calendarId, this.viewDate, this.view);
    this.calendarCommunicationService.updateEventItemsList({noActivity: false, viewDate: this.viewDate});
  }

  dayClicked({date, events}: {
    date: Date;
    events: Array<CalendarEvent<{ event: Event }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
      ) {
        this.calendarCommunicationService.updateEventItemsList({noActivity: true, viewDate: date});
      } else {
        this.viewDate = date;
        this.calendarCommunicationService.updateEventItemsList({noActivity: false, viewDate: date});
      }
    }
    this.viewDate = date;
  }

  eventClicked(event: Event ): void {
    console.log(event);
    /*const e: Event;
    e.title = event.title;
    e.start = event.start;
    e.end = event.end;
    e.description = event.description;
    e.imageUrl = event.imageUrl;
    e.color = event.color;
    e.location = event.location;
    e.creator = event.creator;
    e.meta = event.meta;*/
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

}
