import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../interfaces/event';

@Injectable()
export class TextSliderCommunicationService {

  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  send_data_to_textSlider(arg: any) {
    this.notify.next(arg);
  }

}
