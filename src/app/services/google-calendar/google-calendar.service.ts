import {Injectable, Injector} from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Event } from '../../interfaces/event';
import { AppConfig } from '../../interfaces/appConfig';
import { colors } from '../../utils/colors';
import { APP_CONFIG } from '../../app.config';
import { ths_calendars } from '../../utils/ths-calendars';

import isSameMonth from 'date-fns/is_same_month/index';
import isSameDay from 'date-fns/is_same_day/index';
import startOfMonth from 'date-fns/start_of_month/index';
import endOfMonth from 'date-fns/end_of_month/index';
import startOfWeek from 'date-fns/start_of_week/index';
import endOfWeek from 'date-fns/end_of_week/index';
import startOfDay from 'date-fns/start_of_day/index';
import endOfDay from 'date-fns/end_of_day/index';
import format from 'date-fns/format/index';
import addMonths from 'date-fns/add_months/index';
import addWeeks from 'date-fns/add_weeks/index';
import addDays from 'date-fns/add_days/index';
import subMonths from 'date-fns/sub_months/index';
import subWeeks from 'date-fns/sub_weeks/index';
import subDays from 'date-fns/sub_days/index';

@Injectable()
export class GoogleCalendarService {
  protected config: AppConfig;
  protected search: URLSearchParams = new URLSearchParams();
  view: string;
  public ths_calendars: any[];

  constructor(private http: Http, private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this.view = '';
    this.ths_calendars = ths_calendars;
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

  getAllEvents(viewDate, view): Observable<Event[][]> {
    this.view = view;
    const params: URLSearchParams = new URLSearchParams();
    if (viewDate === null) {
      const startDate = new Date();
      params.set(
          'timeMin',
          format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSz')
      );
      console.log(format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSz'));
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
    const cal1 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[0].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[0].calendarId);});
    const cal2 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[1].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[1].calendarId);});
    const cal3 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[2].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[2].calendarId);});
    const cal4 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[3].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[3].calendarId);});
    const cal5 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[4].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[4].calendarId);});
    const cal6 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[5].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[5].calendarId);});
    const cal7 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[6].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[6].calendarId);});
    const cal8 = this.http.get(this.config.GOOGLE_CALENDAR_BASE_URL + this.ths_calendars[7].calendarId + '/events', { params }).map(res => res.json()).map((res: any)=>{return this.castResToEventType(res, this.ths_calendars[7].calendarId);});

    return Observable.forkJoin([cal1, cal2, cal3, cal4, cal5, cal6, cal7, cal8]);
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
    return this.http
        .get(this.config.GOOGLE_CALENDAR_BASE_URL + calendarId + '/events', { params })
        .map((res: Response) => res.json())
        // Cast response data to event type
        .map((res: any) => {
          return this.castResToEventType(res, calendarId);
        });
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
    return this.http
        .get(this.config.GOOGLE_CALENDAR_BASE_URL + calendarId + '/events', { params })
        .map((res: Response) => res.json())
        // Cast response data to event type
        .map((res: any) => {
          return this.castResToEventType(res, calendarId);
        });
  }

  castResToEventType(res, calendarId) {
    const result: Array<Event> = [];
    res.items.forEach((event) => {
      let imageUrl: string;
      if (event.attachments) {
        imageUrl = this.config.EVENT_IMAGE_BASE_URL + event.attachments[0].fileId;
      }else {
        imageUrl = '';
      }
      result.push({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
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
  }

}
