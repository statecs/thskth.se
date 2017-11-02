import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class NotificationBarCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  private closeNotify = new Subject<any>();
  closeNotifyObservable$ = this.closeNotify.asObservable();

  constructor() { }

  send_data(arg: any) {
    this.notify.next(arg);
  }

  closeBar() {
    this.closeNotify.next();
  }
}
