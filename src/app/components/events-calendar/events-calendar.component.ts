import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { CalendarCommunicationService } from '../../services/component-communicators/calendar-communication.service';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import format from 'date-fns/format/index';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { ths_calendars } from '../../utils/ths-calendars';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss']
})
export class EventsCalendarComponent implements OnInit {

  events: Event[];
  actualDate: string;
  public ths_calendars: any[];
  public showFeaturedEvents: boolean;
  public earliest_events: Event[];
  private lang: string;

  constructor(private calendarCommunicationService: CalendarCommunicationService,
              private googleCalendarService: GoogleCalendarService,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.events = [];
    this.actualDate = format(new Date(), 'DD MMM YYYY');
    this.ths_calendars = ths_calendars;
    this.showFeaturedEvents = true;
    this.earliest_events = [];
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      console.log(this.lang);
      if (this.lang === 'en') {
        this.router.navigate(['events']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  formatDay(start) {
    return format(start, 'MMM DD');
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
    console.log(calendarId);
    if (calendarId === 'all') {
      this.googleCalendarService.getAllEvents(viewDate, 'day').subscribe(res => {
        console.log(res);
        const mergedArrays = this.mergeArrays(res);
        const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
        console.log(sortedArrays);
        this.events = sortedArrays;
        if (this.events.length !== 0) {
          this.showFeaturedEvents = false;
        }
      });
    }else {
      this.googleCalendarService.fetchEvents(calendarId, viewDate, 'day').subscribe(res => {
        console.log(res);
        this.events = res;
        if (this.events.length !== 0) {
          this.showFeaturedEvents = false;
        }
      });
    }
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach((event) => {
      //console.log(event);
      merged = merged.concat(event);
      //console.log(merged);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  ngOnInit() {
    this.calendarCommunicationService.notifyObservable$.subscribe((arg) => {
      this.actualDate = format(arg.viewDate, 'DD MMM YYYY');
      if (arg.noActivity) {
        this.events = [];
        console.log('no activity');
        this.showFeaturedEvents = false;
      }else {
        this.getEventsPerDay(arg.calendarId, arg.viewDate);
      }
      console.log(arg);
    });

    this.getEventsPerDay(this.ths_calendars[0].calendarId, new Date());

    this.googleCalendarService.getAllEvents(null, 'month').subscribe(res => {
      console.log(res);
      const mergedArrays = this.mergeArrays(res);
      const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
      console.log(sortedArrays);
      if (sortedArrays.length > 3) {
        this.earliest_events = sortedArrays.slice(0, 3);
      }else {
        this.earliest_events = sortedArrays;
      }
    });
  }

}
