import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import isSameMonth from 'date-fns/is_same_month/index';
import isSameDay from 'date-fns/is_same_day/index';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs/Observable';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { CalendarCommunicationService } from '../../services/component-communicators/calendar-communication.service';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces-and-classes/event';
import { ths_calendars } from '../../utils/ths-calendars';
import {ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: string;
  viewDate: Date;
  events$: Observable<Array<CalendarEvent<{ event: Event }>>>;
  activeDayIsOpen: boolean;
  public ths_calendars: any[];
  public selected_event_category: number;
  public e_loading: boolean;
  public lang: string;
  public loading: boolean;
  public paramsSubscription: Subscription;

  constructor(private googleCalendarService: GoogleCalendarService,
              private calendarCommunicationService: CalendarCommunicationService,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.view = 'month';
    this.activeDayIsOpen = false;
    this.viewDate = new Date();
    this.ths_calendars = ths_calendars;
    this.selected_event_category = -1;
    this.e_loading = true;
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  switchCalendar(index) {
    this.e_loading = true;
    this.selected_event_category = index;
    if (index === -1) {
      this.getAllEvents();
    }else {
      this.fetchEvents();
    }
    let cal_Id = '';
    if (this.selected_event_category === -1) {
      cal_Id = 'all';
    }else {
      cal_Id = this.ths_calendars[this.selected_event_category].calendarId;
    }
    this.calendarCommunicationService.updateEventItemsList({noActivity: false, viewDate: this.viewDate, calendarId: cal_Id});
  }

  fetchEvents(): void {
    this.e_loading = true;
    if (this.selected_event_category === -1) {
      this.getAllEvents();
    }else {
      this.events$ = this.googleCalendarService.fetchEvents(this.ths_calendars[this.selected_event_category].calendarId, this.viewDate, this.view).map((res) => {
        this.e_loading = false;
        return res;
      },
      (error) => {
        this.notificationBarCommunicationService.send_data(error);
      });
      this.calendarCommunicationService.updateEventItemsList({noActivity: false, viewDate: this.viewDate, calendarId: this.ths_calendars[this.selected_event_category].calendarId});
    }
  }

  dayClicked({date, events}: {
    date: Date;
    events: Array<CalendarEvent<{ event: Event }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      let cal_Id = '';
      if (this.selected_event_category === -1) {
        cal_Id = 'all';
      }else {
        cal_Id = this.ths_calendars[this.selected_event_category].calendarId;
      }
      if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
      ) {
        this.calendarCommunicationService.updateEventItemsList({noActivity: true, viewDate: date, calendarId: cal_Id});
      } else {
        this.viewDate = date;
        this.calendarCommunicationService.updateEventItemsList({noActivity: false, viewDate: date, calendarId: cal_Id});
      }
    }
    this.viewDate = date;
  }

  eventClicked(event: Event ): void {
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach((event) => {
      merged = merged.concat(event);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  getAllEvents() {
    this.events$ = this.googleCalendarService.getAllEvents(this.viewDate, 'month').map(res => {
      const mergedArrays = this.mergeArrays(res);
      this.e_loading = false;
      return mergedArrays.sort(this.sortArrayByTime);
    },
    (error) => {
      this.notificationBarCommunicationService.send_data(error);
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
