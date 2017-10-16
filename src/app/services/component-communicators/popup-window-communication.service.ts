import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../interfaces/event';
import {Association} from '../../interfaces/chapters_associations';
import {Archive} from "../../interfaces/archive";
import {FAQ} from "../../interfaces/faq";

@Injectable()
export class PopupWindowCommunicationService {
  private page_notify = new Subject<any>();
  pageNotifyObservable$ = this.page_notify.asObservable();
  private event_notify = new Subject<any>();
  eventNotifyObservable$ = this.event_notify.asObservable();
  private association_notify = new Subject<any>();
  associationNotifyObservable$ = this.association_notify.asObservable();
  private archive_notify = new Subject<any>();
  archiveNotifyObservable$ = this.archive_notify.asObservable();
  private faq_notify = new Subject<any>();
  faqNotifyObservable$ = this.faq_notify.asObservable();
  private hide_notify = new Subject<any>();
  hideNotifyObservable$ = this.hide_notify.asObservable();
  private loader_notify = new Subject<any>();
  loaderNotifyObservable$ = this.loader_notify.asObservable();

  constructor() { }

  showPageInPopup(page_slug: string) {
    this.page_notify.next(page_slug);
  }

  showEventInPopup(event: Event) {
    this.event_notify.next(event);
  }

  showAssociationInPopup(arg: any) {
    this.association_notify.next(arg);
  }

  showArchiveInPopup(archive: Archive) {
    this.archive_notify.next(archive);
  }

  showFaqInPopup(faq: FAQ) {
    this.faq_notify.next(faq);
  }

  hidePopup(arg: boolean) {
    this.hide_notify.next(arg);
  }

  showLoader() {
    this.loader_notify.next();
  }

}
