import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  public showPopupWindow: boolean;
  public popup_window_updater: Subscription;
  public page_data: any;
  constructor( private wordpressApiService: WordpressApiService,
                private popupWindowCommunicationService: PopupWindowCommunicationService) { }

  show_popup_window(): void {
    this.showPopupWindow = true;
  }

  hide_popup_window(): void {
    this.showPopupWindow = false;
  }

  update_popup_window(slug): void {
    this.wordpressApiService.getPage(slug)
        .subscribe(res => {
          console.log(res);
          this.page_data = res[0];
          this.show_popup_window();
        });
  }

  ngOnInit() {
    this.hide_popup_window();
    this.popup_window_updater = this.popupWindowCommunicationService.notifyObservable$.subscribe((slug) => {
      this.update_popup_window(slug);
    });
  }

}
