import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  expendHeader() {
    this.notify.next('expend');
  }

  collapeHeader() {
    this.notify.next('collapse');
  }

}
