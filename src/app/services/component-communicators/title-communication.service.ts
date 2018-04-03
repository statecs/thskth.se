import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TitleCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  setTitle(arg: any) {
    this.notify.next(arg);
  }


}
