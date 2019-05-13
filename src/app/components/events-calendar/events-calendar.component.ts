import { Component, OnDestroy, OnInit, NgModule, Input } from "@angular/core";
import { Event } from "../../interfaces-and-classes/event";
import { Location } from "@angular/common";
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
  public actualDate: any;
  public slug: string;
  public tomorrowDate: string;
  public nextMonthDate: string;
  public thisMonthDate: string;
  public nextWeekDate: string;
  public selectToday: boolean;
  public selectTomorrow: boolean;
  public selectNextWeek: boolean;
  public selectNextMonth: boolean;
  public selectThisMonth: boolean;
  public ths_calendars: any;
  public showFeaturedEvents: boolean;
  public earliest_events: Event[];
  private lang: string;
  public fetching: boolean;
  public calendarNameSwitch: string;
  public calendarIdSwitch: string;
  public calendarDateSwitch: string;
  public calendarEventSwitch: string;
  public pageNotFound: boolean;
  public dayView: boolean;
  public sum: any;
  public showCalendar: boolean;
  public paramsSubscription: Subscription;
  public allEventsSubscription: Subscription;
  public eventsSubscription: Subscription;
  public allEventsSubscription2: Subscription;
  public calendarSubscription: Subscription;
  public paramsSubscription2: Subscription;

  constructor(
    private location: Location,
    private calendarCommunicationService: CalendarCommunicationService,
    private googleCalendarService: GoogleCalendarService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService
  ) {
    this.events = [];
    this.actualDate = new Date();
    this.tomorrowDate = format(
      new Date(this.actualDate.getTime() + 24 * 60 * 60 * 1000),
      "DD MMM YYYY"
    );
    this.nextWeekDate = format(
      new Date(this.actualDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      "W"
    );
    this.nextMonthDate = format(
      new Date(this.actualDate.getFullYear(), this.actualDate.getMonth() + 1, 1)
    );
    this.thisMonthDate = format(
      new Date(this.actualDate.getFullYear(), this.actualDate.getMonth(), 1)
    );
    this.selectToday = false;
    this.selectTomorrow = false;
    this.selectNextWeek = false;
    this.selectNextMonth = false;
    this.selectThisMonth = false;
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
    if (event !== undefined) {
      this.popupWindowCommunicationService.showEventInPopup(event);
    }
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
  getEventsPerDay(
    calendarId,
    viewDate: Date,
    event_category,
    calendarName
  ): void {
    if (calendarId === "all" && event_category == "allMonth") {
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
      this.dayView = false;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEvents(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.events = sortedArrays;
            this.earliest_events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
            this.fetching = false;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (calendarId === "all" && event_category == "all") {
      this.dayView = false;
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
            this.fetching = false;
          },
          error => {
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (calendarId === "all") {
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
      this.dayView = true;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEvents(viewDate, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.events = sortedArrays;
            this.earliest_events = CalendarComponent.calendar_events;
            this.fetching = false;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (event_category) {
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
      this.dayView = false;
      this.eventsSubscription = this.googleCalendarService
        .fetchEvents(calendarId, viewDate, "month", calendarName)
        .subscribe(
          res => {
            this.earliest_events = res;
            this.fetching = false;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (calendarName == "events") {
      this.dayView = true;
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
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
            this.fetching = false;
          },
          error => {
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.dayView = true;
      this._switchCalendar(calendarId, viewDate, calendarName, event_category);
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
            this.fetching = false;
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
    this.fetching = true;
    this.selectNextMonth = false;
    this.selectNextWeek = false;
    this.selectTomorrow = false;
    this.selectToday = false;
    this.actualDate = new Date();

    if (this.calendarEventSwitch == "allMonth") {
      this.dayView = false;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(this.calendarDateSwitch, "month")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.fetching = false;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else if (this.calendarNameSwitch == "all") {
      this.dayView = false;
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(this.calendarDateSwitch, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
          },
          error => {
            this.fetching = false;
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
            this.fetching = false;
            this.earliest_events = res;
          },
          error => {
            this.fetching = false;
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }
  _switchCalendar(calendarId, viewDate, calendarName, event_category) {
    this.calendarNameSwitch = calendarName;
    this.calendarIdSwitch = calendarId;
    this.calendarDateSwitch = viewDate;
    this.calendarEventSwitch = event_category;
  }

  getEventsPerToday() {
    this.fetching = true;
    this.selectTomorrow = false;
    this.selectNextWeek = false;
    this.selectNextMonth = false;
    this.selectThisMonth = false;
    if (this.selectToday !== true) {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsToday(null, "day")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
            this.fetching = false;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  getEventsPerTomorrow() {
    this.fetching = true;
    this.selectToday = false;
    this.selectNextWeek = false;
    this.selectNextMonth = false;
    this.selectThisMonth = false;
    if (this.selectTomorrow !== true) {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsTomorrow(null, "day")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }
  getEventsPerWeek() {
    this.fetching = true;
    this.selectTomorrow = false;
    this.selectNextMonth = false;
    this.selectToday = false;
    this.selectThisMonth = false;
    if (this.selectNextWeek !== true) {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsNextWeek(null, "week")
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
            this.fetching = false;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  getEventsPerMonth() {
    this.fetching = true;
    this.selectNextWeek = false;
    this.selectTomorrow = false;
    this.selectToday = false;
    this.selectThisMonth = false;
    if (this.selectNextMonth !== true) {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsNextMonth(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  getEventsPerFirstMonth() {
    this.fetching = true;
    this.selectNextWeek = false;
    this.selectTomorrow = false;
    this.selectToday = false;
    this.selectNextMonth = false;
    if (this.selectThisMonth !== true) {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsThisMonth(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    } else {
      this.allEventsSubscription = this.googleCalendarService
        .getAllEventsUpcoming(null, "month")
        .subscribe(
          res => {
            this.fetching = false;
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
            this.earliest_events = sortedArrays;
            this.events = sortedArrays;
            CalendarComponent.calendar_events = sortedArrays;
          },
          error => {
            this.fetching = false;
            this.earliest_events = [];
            this.showFeaturedEvents = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  unStringify(input) {
    return input
      .toLowerCase()
      .split("-")
      .map(i => i[0].toUpperCase() + i.substr(1))
      .join(" ");
  }

  ngOnInit() {
    this.fetching = true;
    this.headerCommunicationService.tranparentHeader(false);
    this.calendarSubscription = this.calendarCommunicationService.notifyObservable$.subscribe(
      arg => {
        this.actualDate = format(arg.viewDate, "DD MMM YYYY");
        this.paramsSubscription2 = this.activatedRoute.params.subscribe(
          (params: Params) => {
            if (this.slug !== null) {
              this.slug = params["slug"];
              if (this.slug) {
                this.slug = this.unStringify(this.slug);
                this.allEventsSubscription = this.googleCalendarService
                  .fetchSingleEvents(this.slug)
                  .subscribe(
                    res => {
                      this.showInPopup(res[0]);
                      this.slug = null;
                    },
                    error => {
                      this.earliest_events = [];
                      this.showFeaturedEvents = false;
                      this.notificationBarCommunicationService.send_data(error);
                    }
                  );
              }
            }
          }
        );
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
    if (this.paramsSubscription2) {
      this.paramsSubscription2.unsubscribe();
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
