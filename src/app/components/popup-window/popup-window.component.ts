import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces/event';
import format from 'date-fns/format/index';
import { AppCommunicationService } from '../../services/component-communicators/app-communication.service';
import {Location} from '@angular/common';
import {Association} from '../../interfaces/chapters_associations';
import {Archive} from '../../interfaces/archive';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {
  @ViewChild('layouts_container') layouts_container: ElementRef;
  public showPopupWindow: boolean;
  public popup_window_updater: Subscription;
  public popup_window_event_updater: Subscription;
  public popup_window_association_updater: Subscription;
  public popup_window_archive_updater: Subscription;
  public page_data: any;
  public showEvent: boolean;
  public event: Event;
  public top_position: number;
  public showAssociation: boolean;
  public association: Association;
  public relatedAssociations: object;
  public archive: Archive;
  public showArchive: boolean;
  public containers: any;

  constructor( private wordpressApiService: WordpressApiService,
               private popupWindowCommunicationService: PopupWindowCommunicationService,
               private appCommunicationService: AppCommunicationService,
               private location: Location ) {
    this.showEvent = false;
    this.top_position = 0;
    this.showAssociation = false;
    this.showArchive = false;
  }

  downloadFile(url: string) {
    window.open(url);
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
    const self = this;
    const timer = setInterval(function () {
      console.log(self.layouts_container)
      if (self.layouts_container) {
        clearInterval(timer);
        self.containers = self.layouts_container.nativeElement.getElementsByClassName('content-container');
        self.layouts_container.nativeElement.style.marginTop = '0';
        for (let i = 0; i < self.containers.length; i++) {
          self.containers[i].style.marginTop = '0';
        }
      }
    }, 100);
  }

  hide_popup_window(): void {
    this.showPopupWindow = false;
    this.appCommunicationService.collapseScrollOnPage('show');
    if (!this.showEvent && !this.showAssociation && !this.showArchive) {
      this.location.back();
    }
    if (this.showAssociation) {
      this.location.go('/associations-and-chapters');
    }
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

  show_association_in_popup(arg): void {
    this.setPosition();
    this.showAssociation = true;
    this.association = arg.association;
    this.relatedAssociations = {
      title: 'Related associations',
      items: arg.relatedAssociations,
      displayed_item: arg.association
    };
    this.show_popup_window();
  }

  show_archive_in_popup(archive): void {
    console.log(archive);
    this.archive = archive;
    this.showArchive = true;
    console.log("popup");
    console.log(archive.documents);
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
    this.popup_window_association_updater = this.popupWindowCommunicationService.associationNotifyObservable$.subscribe((arg) => {
      this.show_association_in_popup(arg);
    });
    this.popup_window_archive_updater = this.popupWindowCommunicationService.archiveNotifyObservable$.subscribe((archive) => {
      this.show_archive_in_popup(archive);
    });
  }

}
