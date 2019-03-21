import { Component, OnDestroy, OnInit, NgModule, Input } from "@angular/core";
import { Event } from "../../interfaces-and-classes/event";
import { CalendarCommunicationService } from "../../services/component-communicators/calendar-communication.service";
import { GoogleCalendarService } from "../../services/google-calendar/google-calendar.service";
import * as format from "date-fns/format";
import { CommonModule } from "@angular/common";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { ths_calendars } from "../../utils/ths-calendars";
import { ActivatedRoute, Params } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { CalendarComponent } from "../../components/calendar/calendar.component";

@Component({
  selector: "app-events-calendar",
  templateUrl: "./events-calendar.component.html",
  styleUrls: ["./events-calendar.component.scss"]
})
export class EventsCalendarComponent implements OnInit, OnDestroy {
  events: Event[];
  actualDate: string;
  public ths_calendars: any;
  public showFeaturedEvents: boolean;
  public earliest_events: Event[];
  private lang: string;
  public calendarNameSwitch: string;
  public calendarIdSwitch: string;
  public calendarDateSwitch: string;
  public pageNotFound: boolean;
  public dayView: boolean;
  public sum: any;
  public showCalendar: boolean;
  public paramsSubscription: Subscription;
  public allEventsSubscription: Subscription;
  public eventsSubscription: Subscription;
  public allEventsSubscription2: Subscription;
  public calendarSubscription: Subscription;

  constructor(
    private calendarCommunicationService: CalendarCommunicationService,
    private googleCalendarService: GoogleCalendarService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService
  ) {
    this.events = [];
    this.actualDate = format(new Date(), "DD MMM YYYY");
    this.ths_calendars = ths_calendars;
    this.showFeaturedEvents = true;
    this.dayView = false;
    this.earliest_events = [];
    this.showCalendar = false;
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.pageNotFound = true;
          this.lang = "en";
        }
        if (this.lang === "sv") {
          this.titleCommunicationService.setTitle("Evenemang");
        } else {
          this.titleCommunicationService.setTitle("Events");
        }
      }
    );
  }

  getBGimage(e): string {
    if (e.imageUrl) {
      return e.imageUrl;
    } else {
      return "../../../assets/images/placeholder-image.png";
    }
  }

  hide_popup_window(): void {
    this.showCalendar = false;
  }

  toggleCalendar(): void {
    this.showCalendar
      ? (this.showCalendar = false)
      : (this.showCalendar = true);
  }

  formatDay(start) {
    return format(start, "MMM DD");
  }

  showInPopup(event: Event): void {
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  formatTime(start, end) {
    return format(start, "h A") + " - " + format(end, "h A");
  }

  formatDate(start, end) {
    return (
      format(start, "dddd, MMM DD") +
      " at " +
      format(start, "hh:mm a") +
      " - " +
      format(end, "hh:mm a")
    );
  }

  // Select - next month update view?
  // CSS IOS? INspired
  getEventsPerDay(
    calendarId,
    viewDate: Date,
    event_category,
    calendarName
  ): void {
    if (calendarId === "all" && event_category == "all") {
      this.dayView = false;
      this._switchCalendar(calendarId, viewDate, event_category);
      this.allEventsSubscription = this.googleCalendarService
        .getAllEvents(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (calendarId === "all") {
      this._switchCalendar(calendarId, viewDate, calendarName);
      this.dayView = true;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEvents(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.events = sortedArrays;
            this.earliest_events = CalendarComponent.calendar_events;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (event_category) {
      this._switchCalendar(calendarId, viewDate, event_category);
      this.dayView = false;
      this.eventsSubscription = this.googleCalendarService
        .fetchEvents(calendarId, viewDate, "month", calendarName)
        .subscribe(
          res => {
            this.earliest_events = res;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (calendarName == "events") {
      this.dayView = true;
      this._switchCalendar(calendarId, viewDate, calendarName);
      this.eventsSubscription = this.googleCalendarService
        .getAllEvents(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.events = sortedArrays;

            this.earliest_events = CalendarComponent.calendar_events;

            if (this.events.length !== 0) {
              this.showFeaturedEvents = false;
            }
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.dayView = true;
      this._switchCalendar(calendarId, viewDate, calendarName);
      this.eventsSubscription = this.googleCalendarService
        .fetchEvents(calendarId, viewDate, "month", calendarName)
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.events = sortedArrays;
            this.earliest_events = CalendarComponent.calendar_events;
            if (this.events.length !== 0) {
              this.showFeaturedEvents = false;
            }
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach(event => {
      merged = merged.concat(event);
    });
    return merged;
  }

  _switchCalendarGet() {
    if (this.calendarNameSwitch == "all") {
      this.dayView = false;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEvents(this.calendarDateSwitch, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
          },
          error => {
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.dayView = false;
      this.eventsSubscription = this.googleCalendarService
        .fetchEvents(
          this.calendarIdSwitch,
          this.calendarDateSwitch,
          "month",
          this.calendarNameSwitch
        )
        .subscribe(
          res => {
            this.earliest_events = res;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }
  _switchCalendar(calendarId, viewDate, calendarName) {
    this.calendarNameSwitch = calendarName;
    this.calendarIdSwitch = calendarId;
    this.calendarDateSwitch = viewDate;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.calendarSubscription = this.calendarCommunicationService.notifyObservable$.subscribe(
      arg => {
        this.actualDate = format(arg.viewDate, "DD MMM YYYY");
        if (arg.noActivity) {
          this.dayView = true;
          this.showFeaturedEvents = false;
        } else {
          this.getEventsPerDay(
            arg.calendarId,
            arg.viewDate,
            arg.event_category,
            arg.calendarName
          );
        }
      }
    );

    this.getEventsPerDay(
      this.ths_calendars.events.calendarId,
      new Date(),
      this.ths_calendars.events.event_category,
      this.ths_calendars.events.calendarName
    );
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
