import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChatbotCommunicationService {
  private hideInfoBox_notify = new Subject<any>();
  hideInfoBoxObservable$ = this.hideInfoBox_notify.asObservable();

  constructor() { }

  hideInfoBox() {
    this.hideInfoBox_notify.next();
  }

}
