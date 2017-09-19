import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../interfaces/event';
import {Association} from '../../interfaces/chapters_associations';

@Injectable()
export class PopupWindowCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  private event_notify = new Subject<any>();
  eventNotifyObservable$ = this.event_notify.asObservable();
  private association_notify = new Subject<any>();
  associationNotifyObservable$ = this.association_notify.asObservable();

  constructor() { }

  update_PopupWindow(page_slug: string) {
    this.notify.next(page_slug);
  }

  showEventInPopup(event: Event) {
    this.event_notify.next(event);
  }

  showAssociationInPopup(association: Association) {
    this.association_notify.next(association);
  }

}
