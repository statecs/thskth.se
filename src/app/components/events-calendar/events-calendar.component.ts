import {Component, OnDestroy, OnInit} from '@angular/core';
import { Event } from '../../interfaces-and-classes/event';
import { CalendarCommunicationService } from '../../services/component-communicators/calendar-communication.service';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import format from 'date-fns/format/index';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { ths_calendars } from '../../utils/ths-calendars';
import {ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss']
})
export class EventsCalendarComponent implements OnInit, OnDestroy {

  events: Event[];
  actualDate: string;
  public ths_calendars: any;
  public showFeaturedEvents: boolean;
  public earliest_events: Event[];
  private lang: string;
  public pageNotFound: boolean;
  public showCalendar: boolean;
  public paramsSubscription: Subscription;
  public allEventsSubscription: Subscription;
  public eventsSubscription: Subscription;
  public allEventsSubscription2: Subscription;
  public calendarSubscription: Subscription;

  constructor(private calendarCommunicationService: CalendarCommunicationService,
              private googleCalendarService: GoogleCalendarService,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private titleCommunicationService: TitleCommunicationService,
              private headerCommunicationService: HeaderCommunicationService) {
    this.events = [];
    this.actualDate = format(new Date(), 'DD MMM YYYY');
    this.ths_calendars = ths_calendars;
    this.showFeaturedEvents = true;
    this.earliest_events = [];
    this.showCalendar = false;
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.pageNotFound = false;
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      if (this.lang === 'sv') {
        this.titleCommunicationService.setTitle('Evenemang');
      }else {
        this.titleCommunicationService.setTitle('Events');
      }
    });
  }

  getBGimage(e): string {
    if (e.imageUrl) {
      return e.imageUrl;
    }else {
      return '../../../assets/images/placeholder-image.png';
    }
  }

  hide_popup_window(): void {
    this.showCalendar = false;
  }

  toggleCalendar(): void {
    (this.showCalendar ? this.showCalendar = false : this.showCalendar = true);
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
    if (calendarId === 'all') {
      this.allEventsSubscription = this.googleCalendarService.getAllEvents(viewDate, 'day').subscribe(res => {
        const mergedArrays = this.mergeArrays(res);
        const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
        this.events = sortedArrays;
        if (this.events.length !== 0) {
          this.showFeaturedEvents = false;
        }
      },
      (error) => {
        this.showFeaturedEvents = false;
        this.notificationBarCommunicationService.send_data(error);
      });
    }else {
      this.eventsSubscription = this.googleCalendarService.fetchEvents(calendarId, viewDate, 'day').subscribe(res => {
        this.events = res;
        if (this.events.length !== 0) {
          this.showFeaturedEvents = false;
        }
      },
      (error) => {
        this.showFeaturedEvents = false;
        this.notificationBarCommunicationService.send_data(error);
      });
    }
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

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.calendarSubscription = this.calendarCommunicationService.notifyObservable$.subscribe((arg) => {
      this.actualDate = format(arg.viewDate, 'DD MMM YYYY');
      if (arg.noActivity) {
        this.events = [];
        this.showFeaturedEvents = false;
      }else {
        this.getEventsPerDay(arg.calendarId, arg.viewDate);
      }
    });

    this.getEventsPerDay(this.ths_calendars.events.calendarId, new Date());

    this.allEventsSubscription2 = this.googleCalendarService.getAllEvents(null, 'month').subscribe(res => {
      const mergedArrays = this.mergeArrays(res);
      const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
      if (sortedArrays.length > 3) {
        this.earliest_events = sortedArrays.slice(0, 3);
      }else {
        this.earliest_events = sortedArrays;
      }
    },
    (error) => {
      this.earliest_events = [];
      this.showFeaturedEvents = false;
      this.notificationBarCommunicationService.send_data(error);
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.allEventsSubscription) {
      this.allEventsSubscription.unsubscribe();
    }
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
    if (this.allEventsSubscription2) {
      this.allEventsSubscription2.unsubscribe();
    }
    if (this.calendarSubscription) {
      this.calendarSubscription.unsubscribe();
    }
  }
}
