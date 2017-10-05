import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SelectSliderCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  private transmit_notify = new Subject<any>();
  transmitNotifyObservable$ = this.transmit_notify.asObservable();

  constructor() { }

  showSelectSlider(arg: any) {
    this.notify.next(arg);
  }

  transmitSelectedItem(arg: any) {
    this.transmit_notify.next(arg);
  }
}
