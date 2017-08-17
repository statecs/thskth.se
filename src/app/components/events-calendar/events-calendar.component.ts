import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { CalendarCommunicationService } from '../../services/component-communicators/calendar-communication.service';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import format from 'date-fns/format/index';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { ths_calendars } from '../../utils/ths-calendars';

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss']
})
export class EventsCalendarComponent implements OnInit {

  events: Event[];
  actualDate: string;
  public ths_calendars: any[];

  constructor(private calendarCommunicationService: CalendarCommunicationService,
              private googleCalendarService: GoogleCalendarService,
              private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.events = [];
    this.actualDate = format(new Date(), 'DD MMM YYYY');
    this.ths_calendars = ths_calendars;
  }

  showInPopup(event: Event): void {
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  formatTime(start, end) {
    return format(start, 'h A') + ' - ' + format(end, 'h A');
  }

  formatDate(start, end) {
    return format(start, 'dddd, MMM DD') + ' at ' + format(start, 'hh:mm a') + ' - ' + format(end, 'hh:mm a');
  }

  getEventsPerDay(calendarId, viewDate: Date): void {
    this.googleCalendarService.fetchEvents(calendarId, viewDate, 'day')
        .subscribe(res => {
          console.log(res);
          this.events = res;
        });
  }

  ngOnInit() {
    this.calendarCommunicationService.notifyObservable$.subscribe((arg) => {
      this.actualDate = format(arg.viewDate, 'DD MMM YYYY');
      if (arg.noActivity) {
        this.events = [];
        console.log('no activity');
      }else {
        this.getEventsPerDay(this.ths_calendars[0].calendarId, arg.viewDate);
      }
      console.log('actualDate');
    });

    this.getEventsPerDay(this.ths_calendars[0].calendarId, new Date());
  }

}
