import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import * as isSameMonth from "date-fns/is_same_month";
import * as isSameDay from "date-fns/is_same_day";
import { CalendarEvent } from "angular-calendar";
import { Observable } from "rxjs/Observable";
import { GoogleCalendarService } from "../../services/google-calendar/google-calendar.service";
import { CalendarCommunicationService } from "../../services/component-communicators/calendar-communication.service";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { Event } from "../../interfaces-and-classes/event";
import { ths_calendars } from "../../utils/ths-calendars";
import { ActivatedRoute, Params } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-calendar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: string;
  viewDate: Date;
  public static calendar_events;
  events$: Observable<Array<CalendarEvent<{ event: Event }>>>;
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean;
  public ths_calendars: any;
  public calendar_names: any[];
  public selected_event_category: string;
  public e_loading: boolean;
  public lang: string;
  public _events: any;
  public loading: boolean;
  public paramsSubscription: Subscription;

  constructor(
    private googleCalendarService: GoogleCalendarService,
    private calendarCommunicationService: CalendarCommunicationService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.view = "month";
    this.activeDayIsOpen = false;
    this.viewDate = new Date();
    this.ths_calendars = ths_calendars;
    this.calendar_names = Object.keys(this.ths_calendars);
    this.selected_event_category = null;
    this.e_loading = true;
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        }
      }
    );
  }

  switchCalendar(calendar_name: string) {
    this.e_loading = true;
    this.selected_event_category = calendar_name;
    let cal_Id = "";
    if (calendar_name === null) {
      calendar_name = "all";
      cal_Id = "all";
      this.getAllEvents(this.viewDate);
    } else {
      cal_Id = this.ths_calendars[this.selected_event_category].calendarId;
      this.fetchEvents();
    }
    this.calendarCommunicationService.updateEventItemsList({
      noActivity: false,
      viewDate: this.viewDate,
      calendarId: cal_Id,
      event_category: calendar_name
    });
  }

  fetchEvents(): void {
    this.e_loading = true;
    if (this.selected_event_category === null) {
      this.getAllEvents(this.viewDate);

      this.calendarCommunicationService.updateEventItemsList({
        noActivity: false,
        monthView: true,
        viewDate: this.viewDate,
        calendarId: "all",
        event_category: "all"
      });
    } else {
      this.events$ = this.googleCalendarService
        .fetchEvents(
          this.ths_calendars[this.selected_event_category].calendarId,
          this.viewDate,
          this.view,
          this.ths_calendars[this.selected_event_category].calendarName
        )
        .map(
          res => {
            const mergedArrays = this.mergeArrays(res);
            this.e_loading = false;
            CalendarComponent.calendar_events = mergedArrays.sort(
              this.sortArrayByTime
            );
            res = mergedArrays.sort(this.sortArrayByTime);
            this.events = mergedArrays.sort(this.sortArrayByTime);
            return mergedArrays.sort(this.sortArrayByTime);
          },
          error => {
            this.notificationBarCommunicationService.send_data(error);
          }
        );
      this.calendarCommunicationService.updateEventItemsList({
        noActivity: false,
        monthView: true,
        viewDate: this.viewDate,
        calendarId: this.ths_calendars[this.selected_event_category].calendarId,
        event_category: this.ths_calendars[this.selected_event_category]
          .calendarName
      });
    }
  }

  changeMonth(): void {
    this.e_loading = true;
    if (this.selected_event_category === null) {
      this.getAllEvents(this.viewDate);

      this.calendarCommunicationService.updateEventItemsList({
        noActivity: false,
        monthView: true,
        viewDate: this.viewDate,
        calendarId: "all",
        event_category: "allMonth"
      });
    } else {
      this.events$ = this.googleCalendarService
        .fetchEvents(
          this.ths_calendars[this.selected_event_category].calendarId,
          this.viewDate,
          this.view,
          this.ths_calendars[this.selected_event_category].calendarName
        )
        .map(
          res => {
            const mergedArrays = this.mergeArrays(res);
            this.e_loading = false;
            CalendarComponent.calendar_events = mergedArrays.sort(
              this.sortArrayByTime
            );
            this.events = mergedArrays.sort(this.sortArrayByTime);
            return mergedArrays.sort(this.sortArrayByTime);
          },
          error => {
            this.notificationBarCommunicationService.send_data(error);
          }
        );
      this.calendarCommunicationService.updateEventItemsList({
        noActivity: false,
        monthView: true,
        viewDate: this.viewDate,
        calendarId: this.ths_calendars[this.selected_event_category].calendarId,
        event_category: this.ths_calendars[this.selected_event_category]
          .calendarName
      });
    }
  }
  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ event: Event }>>;
  }): void {
    let calendarName = "";
    CalendarComponent.calendar_events = events;
    if (isSameMonth(date, this.viewDate)) {
      let cal_Id = "";
      if (this.selected_event_category === null) {
        cal_Id = "all";
        calendarName = "all";
      } else {
        cal_Id = this.ths_calendars[this.selected_event_category].calendarId;
        calendarName = this.ths_calendars[this.selected_event_category]
          .calendarName;
      }
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.calendarCommunicationService.updateEventItemsList({
          noActivity: true,
          viewDate: date,
          calendarId: cal_Id,
          calendarName: calendarName
        });
      } else {
        this.viewDate = date;
        this.calendarCommunicationService.updateEventItemsList({
          noActivity: false,
          viewDate: date,
          calendarId: cal_Id,
          calendarName: calendarName
        });
      }
    }
    this.viewDate = date;
  }

  eventClicked(event: Event): void {
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach(event => {
      merged = merged.concat(event);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  getAllEvents(viewDate) {
    this.events$ = this.googleCalendarService
      .getAllEvents(viewDate, "month")
      .map(
        res => {
          const mergedArrays = this.mergeArrays(res);
          this.e_loading = false;
          this.cdRef.detectChanges();
          return mergedArrays.sort(this.sortArrayByTime);
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
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
