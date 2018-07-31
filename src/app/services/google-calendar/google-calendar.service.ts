import {Injectable, Injector} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { Event } from '../../interfaces-and-classes/event';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { colors } from '../../utils/colors';
import { APP_CONFIG } from '../../app.config';
import { ths_calendars } from '../../utils/ths-calendars';
import startOfMonth from 'date-fns/start_of_month/index';
import endOfMonth from 'date-fns/end_of_month/index';
import startOfWeek from 'date-fns/start_of_week/index';
import endOfWeek from 'date-fns/end_of_week/index';
import startOfDay from 'date-fns/start_of_day/index';
import endOfDay from 'date-fns/end_of_day/index';
import format from 'date-fns/format/index';
import addDays from 'date-fns/add_days/index';
import subDays from 'date-fns/sub_days/index';
import {BaseDataInterface, BaseDataService} from '../abstract-services/base-data.service';
import {DataFetcherService} from '../utility/data-fetcher.service';
import * as _ from 'lodash';

@Injectable()
export class GoogleCalendarService extends BaseDataService<Event> {
  protected config: AppConfig;
  protected search: URLSearchParams = new URLSearchParams();
  view: string;
  public ths_calendars: any[];

  constructor(protected dataFetcherService: DataFetcherService, private injector: Injector) {
    super(dataFetcherService, injector.get(APP_CONFIG).GOOGLE_CALENDAR_BASE_URL);
    this.config = injector.get(APP_CONFIG);
    this.view = '';
    this.ths_calendars = ths_calendars;
  }

  getAllEvents(viewDate, view): Observable<Event[]> {
    this.view = view;
    const params: URLSearchParams = new URLSearchParams();
    if (viewDate === null) {
      const startDate = new Date();
      params.set(
          'timeMin',
          format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSz')
      );
    }else {
      params.set(
          'timeMin',
          format(this.getStart(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
      );
      params.set(
          'timeMax',
          format(this.getEnd(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
      );
    }
    params.set('key', this.config.GOOGLE_CALENDAR_KEY);
    params.set('singleEvents', 'true');
    params.set('orderBy', 'startTime');
    params.set('maxResults', '4');
    const observables: Observable<any>[] = [];
    observables.push(this.getData(this.ths_calendars[0].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[1].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[2].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[3].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[4].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[5].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[6].calendarId + '/events', params));
    observables.push(this.getData(this.ths_calendars[7].calendarId + '/events', params));

    return Observable.combineLatest(observables).map(values => {
      let events: Event[] = [];
      _.each(values, (value) => {
        events = events.concat(value);
      });
      return events;
    });
  }

  fetchEvents(calendarId, viewDate, view): Observable<Event[]> {
    this.view = view;
    const params: URLSearchParams = new URLSearchParams();
    params.set(
        'timeMin',
        format(this.getStart(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
    );
    params.set(
        'timeMax',
        format(this.getEnd(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
    );
    params.set('key', this.config.GOOGLE_CALENDAR_KEY);
    params.set('singleEvents', 'true');
    params.set('orderBy', 'startTime');
    return this.getData(calendarId + '/events', params);
  }

  getUpcomingEvents(calendarId, amount): Observable<Event[]> {
    const params: URLSearchParams = new URLSearchParams();
    const startDate = new Date();
    params.set(
        'timeMin',
        format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSz')
    );
    params.set('key', this.config.GOOGLE_CALENDAR_KEY);
    params.set('singleEvents', 'true');
    params.set('orderBy', 'startTime');
    params.set('maxResults', amount);
    return this.getData(calendarId + '/events', params);
  }

  getStart(viewDate: any): any {
    switch (this.view) {
      case 'month':
        return subDays(startOfMonth(viewDate), 7);
      case 'week':
        return startOfWeek(viewDate);
      case 'day':
        return startOfDay(viewDate);
      default:
        console.log('Wrong view');
    }
  }

  getEnd(viewDate: any): any {
    switch (this.view) {
      case 'month':
        return addDays(endOfMonth(viewDate), 7);
      case 'week':
        return endOfWeek(viewDate);
      case 'day':
        return endOfDay(viewDate);
      default:
        console.log('Wrong view');
    }
  }

/*
  castResToEventType(res, calendarId) {
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
