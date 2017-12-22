import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  private positionHeaderNotify = new Subject<any>();
  positionHeaderObservable$ = this.positionHeaderNotify.asObservable();
  private tranparentHeaderNotify = new Subject<any>();
  tranparentHeaderObservable$ = this.tranparentHeaderNotify.asObservable();
  private menuNotify = new Subject<any>();
  menuObservable$ = this.menuNotify.asObservable();

  constructor() { }

  expendHeader() {
    this.notify.next('expend');
  }

  collapseHeader() {
    this.notify.next('collapse');
  }

  positionHeader(arg: number) {
    this.positionHeaderNotify.next(arg);
  }

  tranparentHeader(arg: boolean) {
    this.tranparentHeaderNotify.next(arg);
  }

  hideMenu() {
    this.menuNotify.next();
  }
}
