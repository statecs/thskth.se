import { Injectable, Injector } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/merge";
import { map, mergeAll } from "rxjs/operators";
import { Event } from "../../interfaces-and-classes/event";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { APP_CONFIG } from "../../app.config";
import * as startOfMonth from "date-fns/start_of_month";
import * as endOfMonth from "date-fns/end_of_month";
import * as startOfWeek from "date-fns/start_of_week";
import * as endOfWeek from "date-fns/end_of_week";
import * as startOfDay from "date-fns/start_of_day";
import * as endOfDay from "date-fns/end_of_day";
import * as format from "date-fns/format";
import * as addDays from "date-fns/add_days";
import * as subDays from "date-fns/sub_days";
import { DataFetcherService } from "../utility/data-fetcher.service";
import * as _ from "lodash";
import { EventsCalendarService } from "./events.calendar.service";
import { GeneralCalendarService } from "./general.calendar.service";
import { EducationCalendarService } from "./education.calendar.service";
import { FutureCalendarService } from "./future.calendar.service";
import { InternationalCalendarService } from "./international.calendar.service";
import { ths_calendars, THSCalendar } from "../../utils/ths-calendars";

@Injectable()
export class GoogleCalendarService {
  protected config: AppConfig;
  protected search: URLSearchParams = new URLSearchParams();
  view: string;
  private ths_calendars: { [key: string]: THSCalendar };

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private eventsCalendarService: EventsCalendarService,
    private generalCalendarService: GeneralCalendarService,
    private educationCalendarService: EducationCalendarService,
    private futureCalendarService: FutureCalendarService,
    private internationalCalendarService: InternationalCalendarService //private receptionCalendarService: ReceptionCalendarService
  ) {
    this.config = injector.get(APP_CONFIG);
    this.view = "";
    this.ths_calendars = ths_calendars;
  }

  getAllEvents(viewDate, view): Observable<Event[]> {
    this.view = view;
    const params: URLSearchParams = new URLSearchParams();
    if (viewDate === null) {
      const startDate = new Date();
      params.set("timeMin", format(startDate, "YYYY-MM-DDTHH:mm:ss.SSSz"));
    } else {
      params.set("timeMin", format(viewDate, "YYYY-MM-DDTHH:mm:ss.SSSz"));
      params.set(
        "timeMax",
        format(this.getEnd(viewDate), "YYYY-MM-DDTHH:mm:ss.SSSz")
      );
    }
    params.set("key", this.config.GOOGLE_CALENDAR_KEY);
    params.set("singleEvents", "true");
    params.set("orderBy", "startTime");
    params.set("maxResults", "10");
    const observables: Observable<any>[] = [];
    observables.push(this.eventsCalendarService.getCalendar(params));
    observables.push(this.generalCalendarService.getCalendar(params));
    observables.push(this.educationCalendarService.getCalendar(params));
    observables.push(this.futureCalendarService.getCalendar(params));
    observables.push(this.internationalCalendarService.getCalendar(params));
    return Observable.combineLatest(observables).map(values => {
      let events: Event[] = [];
      _.each(values, value => {
        events = events.concat(value);
      });
      return events;
    });
  }

  fetchEvents(calendarId, viewDate, view, calendarName): Observable<Event[]> {
    this.view = view;
    const params: URLSearchParams = new URLSearchParams();
    params.set(
      "timeMin",
      format(this.getStart(viewDate), "YYYY-MM-DDTHH:mm:ss.SSSz")
    );
    params.set(
      "timeMax",
      format(this.getEnd(viewDate), "YYYY-MM-DDTHH:mm:ss.SSSz")
    );
    params.set("key", this.config.GOOGLE_CALENDAR_KEY);
    params.set("singleEvents", "true");
    params.set("orderBy", "startTime");
    const calendar: THSCalendar = _.find(this.ths_calendars, c => {
      return c.calendarId === calendarId;
    });
    return this.dataFetcherService
      .get(
        this.config.GOOGLE_CALENDAR_BASE_URL + calendarId + "/events",
        params
      )
      .map(res =>
        Event.convertToEventType(
          res,
          calendarId,
          this.config.EVENT_IMAGE_BASE_URL,
          calendar.calendarName
        )
      );
  }

  getUpcomingEvents(calendarId, amount): Observable<Event[]> {
    const params: URLSearchParams = new URLSearchParams();
    const startDate = new Date();
    params.set("timeMin", format(startDate, "YYYY-MM-DDTHH:mm:ss.SSSz"));
    params.set("key", this.config.GOOGLE_CALENDAR_KEY);
    params.set("singleEvents", "true");
    params.set("orderBy", "startTime");
    params.set("maxResults", amount);
    const calendar: THSCalendar = _.find(this.ths_calendars, c => {
      return c.calendarId === calendarId;
    });
    return this.dataFetcherService
      .get(
        this.config.GOOGLE_CALENDAR_BASE_URL + calendarId + "/events",
        params
      )
      .map(res =>
        Event.convertToEventType(
          res,
          calendarId,
          this.config.EVENT_IMAGE_BASE_URL,
          calendar.calendarName
        )
      );
  }

  getStart(viewDate: any): any {
    switch (this.view) {
      case "month":
        return startOfMonth(viewDate);
      case "week":
        return startOfWeek(viewDate);
      case "day":
        return startOfDay(viewDate);
      default:
        console.log("Wrong view");
    }
  }

  getEnd(viewDate: any): any {
    switch (this.view) {
      case "month":
        return endOfMonth(viewDate);
      case "week":
        return endOfWeek(viewDate);
      case "day":
        return endOfDay(viewDate);
      default:
        console.log("Wrong view");
    }
  }

  /*castResToEventType(res, calendarId) {
    const result: Array<Event> = [];
    res.items.forEach((event) => {
      let imageUrl: string;
      if (event.attachments) {
        imageUrl = this.config.EVENT_IMAGE_BASE_URL + event.attachments[0].fileId;
      }else {
        imageUrl = '';
      }
      let start: Date;
      if (event.start.dateTime) {
        start = new Date(event.start.dateTime);
      }else if (event.start.date) {
        start = new Date(Date.parse(event.start.date));
      }
      let end: Date;
      if (event.end.dateTime) {
        end = new Date(event.end.dateTime);
      }else if (event.end.date) {
        end = new Date(Date.parse(event.end.date));
      }
      result.push({
        id: event.id,
        title: event.summary,
        start: start,
        end: end,
        description: event.description,
        imageUrl: imageUrl,
        color: colors.yellow,
        location: event.location,
        creator: event.creator,
        meta: {
          event
        },
        calendarId: calendarId
      });
    });
    return result;
  }*/
}
