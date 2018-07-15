import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../interfaces-and-classes/event';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';

@Injectable()
export class CalendarCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  updateEventItemsList(arg: object) {
    this.notify.next(arg);
  }

}
