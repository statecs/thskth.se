import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  collapseScrollOnPage(arg: string) {
    this.notify.next(arg);
  }

}
