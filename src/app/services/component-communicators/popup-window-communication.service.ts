import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../interfaces/event';

@Injectable()
export class PopupWindowCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  private event_notify = new Subject<any>();
  eventNotifyObservable$ = this.event_notify.asObservable();

  constructor() { }

  update_PopupWindow(page_slug: string) {
    this.notify.next(page_slug);
  }

  showEventInPopup(event: Event) {
    this.event_notify.next(event);
  }

}
