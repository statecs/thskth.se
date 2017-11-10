import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HideUICommunicationService {
  private hideUI_notify = new Subject<any>();
  hideUIObservable$ = this.hideUI_notify.asObservable();

  constructor() { }

  hideOverlappingElements() {
    this.hideUI_notify.next();
  }
}
