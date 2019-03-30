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
export class EventsTHSService extends BaseDataService<Event> {
  protected config: AppConfig;
  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).EVENTS_URL + "?lang=en");
    this.config = injector.get(APP_CONFIG);
  }

  getCalendar(): Observable<Event[]> {
    return this.dataFetcherService
      .get(this.config.EVENTS_URL + "?lang=en")
      .map(res => Event.convertFBToEventType(res));
  }
}
