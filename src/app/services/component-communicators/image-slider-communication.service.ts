import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ImageSliderCommunicationService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  send_data_to_imageSlider(arg: any) {
    this.notify.next(arg);
  }
}
