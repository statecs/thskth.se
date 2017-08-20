import { Component, OnInit, HostListener } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces/event';
import format from 'date-fns/format/index';
import { AppCommunicationService } from '../../services/component-communicators/app-communication.service';
import {Location} from '@angular/common';

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
  public top_position: number;

  constructor( private wordpressApiService: WordpressApiService,
                private popupWindowCommunicationService: PopupWindowCommunicationService,
                private appCommunicationService: AppCommunicationService,
               private location: Location ) {
    this.showEvent = false;
    this.top_position = 0;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = (window.pageYOffset || document.body.scrollTop) + 100;
    if (scrollTop < this.top_position) {
      this.top_position = scrollTop;
    }
  }

  setPosition() {
    this.top_position = (window.pageYOffset || document.body.scrollTop) + 100;
  }

  getDate(start) {
    return format(start, 'DD MMM');
  }

  formatDate(start, end) {
    return format(start, 'dddd, MMM DD') + ' at ' + format(start, 'hh:mm a') + ' - ' + format(end, 'hh:mm a');
  }

  show_popup_window(): void {
    this.showPopupWindow = true;
    this.appCommunicationService.collapseScrollOnPage('collapse');
  }

  hide_popup_window(): void {
    this.showPopupWindow = false;
    this.appCommunicationService.collapseScrollOnPage('show');
    this.location.back();
  }

  update_popup_window(slug): void {
    this.setPosition();
    this.showEvent = false;
    this.show_popup_window();
    this.wordpressApiService.getPage(slug)
        .subscribe(res => {
          console.log(res);
          this.page_data = res[0];
        });
  }

  show_event_in_popup(event): void {
    this.setPosition();
    this.showEvent = true;
    this.event = event;
    this.show_popup_window();
  }

  ngOnInit() {
    this.showPopupWindow = false;
    this.appCommunicationService.collapseScrollOnPage('show');
    this.popup_window_updater = this.popupWindowCommunicationService.notifyObservable$.subscribe((slug) => {
      this.update_popup_window(slug);
    });
    this.popup_window_event_updater = this.popupWindowCommunicationService.eventNotifyObservable$.subscribe((event) => {
      this.show_event_in_popup(event);
    });
  }

}
