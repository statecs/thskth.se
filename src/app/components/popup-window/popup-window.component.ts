import {Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import { Event } from '../../interfaces/event';
import format from 'date-fns/format/index';
import { AppCommunicationService } from '../../services/component-communicators/app-communication.service';
import {Location} from '@angular/common';
import {Association} from '../../interfaces/chapters_associations';
import {Archive} from '../../interfaces/archive';
import {FAQ} from '../../interfaces/faq';
import {Router, RoutesRecognized} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {PagesService} from '../../services/wordpress/pages.service';
import {Post} from '../../interfaces/post';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit, OnDestroy {
  @ViewChild('layouts_container') layouts_container: ElementRef;
  public showPopupWindow: boolean;
  public popup_window_updater: Subscription;
  public popup_window_event_updater: Subscription;
  public popup_window_association_updater: Subscription;
  public popup_window_archive_updater: Subscription;
  public popup_window_faq_updater: Subscription;
  public popup_window_hide_updater: Subscription;
  public popup_window_loader_updater: Subscription;
  public popup_window_news_updater: Subscription;
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
  public showFaq: boolean;
  public faq: FAQ;
  public showPage: boolean;
  public loading: boolean;
  public lang: string;
  public paramsSubscription: Subscription;
  public pageSubscription: Subscription;
  public news: Post;
  public showNews: boolean;
  public page_location: string;

  constructor( private pagesService: PagesService,
               private popupWindowCommunicationService: PopupWindowCommunicationService,
               private appCommunicationService: AppCommunicationService,
               private location: Location,
               private router: Router,
               private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.showEvent = false;
    this.top_position = 0;
    this.showAssociation = false;
    this.showArchive = false;
    this.showFaq = false;
    this.showPage = false;
    this.loading = false;
    this.paramsSubscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
      }
    });
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

    /*if (!this.showPopupWindow && scrollTop > 200) {
      this.startPos = (document.body.scrollTop || window.pageYOffset);
    }*/
  }

  setPosition() {
    this.top_position = 100;
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
      if (self.layouts_container) {
        clearInterval(timer);
        self.containers = self.layouts_container.nativeElement.getElementsByClassName('content-container');
        self.layouts_container.nativeElement.style.marginTop = '100px';
        for (let i = 0; i < self.containers.length; i++) {
          self.containers[i].style.marginTop = '0';
        }
      }
    }, 100);
  }

  hide_all_layouts(): void {
    this.showEvent = false;
    this.showAssociation = false;
    this.showArchive = false;
    this.showFaq = false;
    this.showPage = false;
  }

  hide_popup_window(): void {
    this.appCommunicationService.collapseScrollOnPage('show');
    if (this.showPage) {
      this.location.back();
    }
    if (this.showAssociation) {
      if (this.lang === 'sv') {
        this.router.navigate(['sv/associations-and-chapters']);
      }else {
        this.router.navigate(['en/associations-and-chapters']);
      }
    }
    if (this.showNews) {
      console.log(this.page_location);
      if (this.page_location === 'home') {
        this.location.back();
      }else if (this.page_location === 'news') {
        if (this.lang === 'sv') {
          this.router.navigate(['sv/news']);
        }else {
          this.router.navigate(['en/news']);
        }
      }
    }
    this.hide_all_layouts();
    this.showPopupWindow = false;
  }

  show_page_in_popup(slug): void {
    this.loading = true;
    this.setPosition();
    this.showEvent = false;
    this.showPage = true;
    this.show_popup_window();
    this.pageSubscription = this.pagesService.getPageBySlug(slug, this.lang).subscribe(res => {
          console.log(res);
          this.page_data = res;
          this.loading = false;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
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
    console.log(archive.documents);
    this.show_popup_window();
  }

    show_faq_in_popup(faq): void {
        console.log(faq);
        this.faq = faq;
        this.showFaq = true;
        this.show_popup_window();
    }

    show_news_in_popup(article): void {
      console.log(article);
      this.news = article;
      this.showNews = true;
      this.show_popup_window();
    }

  ngOnInit() {
    this.showPopupWindow = false;
    this.appCommunicationService.collapseScrollOnPage('show');
    this.popup_window_updater = this.popupWindowCommunicationService.pageNotifyObservable$.subscribe((slug) => {
      this.show_page_in_popup(slug);
    });
    this.popup_window_event_updater = this.popupWindowCommunicationService.eventNotifyObservable$.subscribe((event) => {
      this.loading = false;
      this.show_event_in_popup(event);
    });
    this.popup_window_association_updater = this.popupWindowCommunicationService.associationNotifyObservable$.subscribe((arg) => {
      this.loading = false;
      this.show_association_in_popup(arg);
    });
    this.popup_window_archive_updater = this.popupWindowCommunicationService.archiveNotifyObservable$.subscribe((archive) => {
      this.loading = false;
      this.show_archive_in_popup(archive);
    });
    this.popup_window_faq_updater = this.popupWindowCommunicationService.faqNotifyObservable$.subscribe((faq) => {
      this.loading = false;
      this.show_faq_in_popup(faq);
    });
    this.popup_window_hide_updater = this.popupWindowCommunicationService.hideNotifyObservable$.subscribe((arg) => {
      if (arg === true) {
        this.hide_popup_window();
      }
    });
    this.popup_window_loader_updater = this.popupWindowCommunicationService.loaderNotifyObservable$.subscribe(() => {
      this.loading = true;
    });
    this.popup_window_news_updater = this.popupWindowCommunicationService.newsNotifyObservable$.subscribe((arg) => {
      this.loading = true;
      if (arg) {
        this.loading = false;
        this.page_location = arg.page_location;
        this.show_news_in_popup(arg.article);
      }else {
        this.show_news_in_popup(arg);
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.popup_window_updater) {
      this.popup_window_updater.unsubscribe();
    }
    if (this.popup_window_event_updater) {
      this.popup_window_event_updater.unsubscribe();
    }
    if (this.popup_window_association_updater) {
      this.popup_window_association_updater.unsubscribe();
    }
    if (this.popup_window_archive_updater) {
      this.popup_window_archive_updater.unsubscribe();
    }
    if (this.popup_window_faq_updater) {
      this.popup_window_faq_updater.unsubscribe();
    }
    if (this.popup_window_hide_updater) {
      this.popup_window_hide_updater.unsubscribe();
    }
    if (this.popup_window_loader_updater) {
      this.popup_window_loader_updater.unsubscribe();
    }
    if (this.popup_window_news_updater) {
      this.popup_window_news_updater.unsubscribe();
    }
  }
}
