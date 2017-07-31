import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces/event';
import format from 'date-fns/format/index';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  public showPopupWindow: boolean;
  public popup_window_updater: Subscription;
  public popup_window_event_updater: Subscription;
  public page_data: any;
  public showEvent: boolean;
  public event: Event;

  constructor( private wordpressApiService: WordpressApiService,
                private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.showEvent = false;
  }

  getDate(start) {
    return format(start, 'DD MMM');
  }

  formatDate(start, end) {
    return format(start, 'dddd, MMM DD') + ' at ' + format(start, 'hh:mm a') + ' - ' + format(end, 'hh:mm a');
  }

  show_popup_window(): void {
    this.showPopupWindow = true;
  }

  hide_popup_window(): void {
    this.showPopupWindow = false;
  }

  update_popup_window(slug): void {
    this.showEvent = false;
    this.wordpressApiService.getPage(slug)
        .subscribe(res => {
          console.log(res);
          this.page_data = res[0];
          this.show_popup_window();
        });
  }

  show_event_in_popup(event): void {
    this.showEvent = true;
    this.event = event;
    this.show_popup_window();
  }

  ngOnInit() {
    this.hide_popup_window();
    this.popup_window_updater = this.popupWindowCommunicationService.notifyObservable$.subscribe((slug) => {
      this.update_popup_window(slug);
    });
    this.popup_window_event_updater = this.popupWindowCommunicationService.eventNotifyObservable$.subscribe((event) => {
      this.show_event_in_popup(event);
    });
  }

}
