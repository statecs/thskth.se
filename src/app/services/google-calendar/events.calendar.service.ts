import { Injectable, Injector } from '@angular/core';
import { APP_CONFIG } from '../../app.config';
import {BaseDataService} from '../abstract-services/base-data.service';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {Event} from '../../interfaces-and-classes/event';
import { ths_calendars } from '../../utils/ths-calendars';
import {GoogleCalendarService} from './google-calendar.service';
import {Observable} from 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';

@Injectable()
export class EventsCalendarService extends BaseDataService<Event> {

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private googleCalendarService: GoogleCalendarService) {
        super(dataFetcherService, injector.get(APP_CONFIG).GOOGLE_CALENDAR_BASE_URL + ths_calendars[0].calendarId + '/events');
    }

    getCalendar(params: URLSearchParams): Observable<Event[]> {
        return this.getData(null, params)
            .map(res => this.googleCalendarService.castResToEventType(res, ths_calendars[0].calendarId));
    }
}
