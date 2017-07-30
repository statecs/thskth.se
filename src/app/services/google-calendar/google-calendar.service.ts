import {Injectable, Injector} from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Event } from '../../interfaces/event';
import { AppConfig } from '../../interfaces/appConfig';
import { colors } from '../../utils/colors';
import { APP_CONFIG } from '../../app.config';

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

  constructor(private http: Http, private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this.view = '';
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

  fetchEvents(viewDate, view): Observable<Event[]> {
    this.view = view;
    this.search.set(
        'timeMin',
        format(this.getStart(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
    );
    this.search.set(
        'timeMax',
        format(this.getEnd(viewDate), 'YYYY-MM-DDTHH:mm:ss.SSSz')
    );
    this.search.set('key', this.config.GOOGLE_CALENDAR_KEY);
    this.search.set('singleEvents', 'true');
    this.search.set('orderBy', 'startTime');
    const params = this.search;
    return this.http
        .get(this.config.GOOGLE_CALENDAR_URL, { params })
        .map((res: Response) => res.json())
        // Cast response data to event type
        .map((res: any) => {
        console.log(params);
        console.log(res);
          const result: Array<Event> = [];
          res.items.forEach((event) => {
            let imageUrl: string;
            if (event.attachments) {
              imageUrl = this.config.EVENT_IMAGE_BASE_URL + event.attachments[0].fileId;
            }else {
              imageUrl = '';
            }
            console.log(imageUrl);
            result.push({
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
              }
            });
          });
          return result;
        });
  }

}
