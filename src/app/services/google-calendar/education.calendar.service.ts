import { Injectable, Injector } from "@angular/core";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { BaseDataService } from "../abstract-services/base-data.service";
import { DataFetcherService } from "../utility/data-fetcher.service";
import { Event } from "../../interfaces-and-classes/event";
import { ths_calendars } from "../../utils/ths-calendars";
import { Observable } from "rxjs/Observable";
import { URLSearchParams } from "@angular/http";

@Injectable()
export class EducationCalendarService extends BaseDataService<Event> {
  protected config: AppConfig;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector
  ) {
    super(
      dataFetcherService,
      injector.get(APP_CONFIG).GOOGLE_CALENDAR_BASE_URL +
        ths_calendars.education.calendarId +
        "/events"
    );
    this.config = injector.get(APP_CONFIG);
  }

  getCalendar(params: URLSearchParams): Observable<Event[]> {
    return this.dataFetcherService
      .get(
        this.config.GOOGLE_CALENDAR_BASE_URL +
          ths_calendars.education.calendarId +
          "/events",
        params
      )
      .map(res =>
        Event.convertToEventType(
          res,
          ths_calendars.education.calendarId,
          this.injector.get(APP_CONFIG).EVENT_IMAGE_BASE_URL,
          ths_calendars.education.calendarName
        )
      );
  }
}
