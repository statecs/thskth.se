import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { Event } from "../../interfaces-and-classes/event";
import * as format from "date-fns/format";
import { AppCommunicationService } from "../../services/component-communicators/app-communication.service";
import { Location } from "@angular/common";
import { Association } from "../../interfaces-and-classes/chapters_associations";
import { Archive } from "../../interfaces-and-classes/archive";
import { FAQ } from "../../interfaces-and-classes/faq";
import { Router, RoutesRecognized, NavigationStart } from "@angular/router";
import { CookieService } from "ngx-cookie";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { PagesService } from "../../services/wordpress/pages.service";
import { SanitizeHtmlPipe } from "../../pipes/sanitizeHtml.pipe";
import { DomSanitizer } from "@angular/platform-browser";
import { Post } from "../../interfaces-and-classes/post";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";

@Component({
  selector: "app-popup-window",
  templateUrl: "./popup-window.component.html",
  styleUrls: ["./popup-window.component.scss"]
})
export class PopupWindowComponent implements OnInit, OnDestroy {
  @ViewChild("layouts_container") layouts_container: ElementRef;
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
  public previousUrl: string;
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
  public navigateBack: boolean;
  public exit_btn1: boolean;
  public exit_btn2: boolean;
  public show_page_not_found: boolean = false;
  sanitizeHtmlPipe: SanitizeHtmlPipe;

  constructor(
    private pagesService: PagesService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private appCommunicationService: AppCommunicationService,
    private location: Location,
    private _cookieService: CookieService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private titleCommunicationService: TitleCommunicationService,
    private notificationBarCommunicationService: NotificationBarCommunicationService
  ) {
    this.sanitizeHtmlPipe = new SanitizeHtmlPipe(domSanitizer);
    this.showEvent = false;
    this.top_position = 0;
    this.showAssociation = false;
    this.showArchive = false;
    this.showFaq = false;
    this.showPage = false;
    this.loading = false;
    this.navigateBack = true;
    this.exit_btn1 = true;
    this.exit_btn2 = false;
    this.paramsSubscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.lang = "en";
        }
      }
    });
  }

  formatDate_News(created_time): string {
    return format(created_time, "YYYY-MM-DD");
  }

  downloadFile(url: string) {
    window.open(url);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.body.scrollTop;
    const scrollPos = scrollTop + 100;
    if (scrollPos < this.top_position) {
      this.top_position = scrollPos;
    }

    if (scrollTop > 0 && !this.exit_btn2) {
      this.exit_btn2 = true;
      if (this.exit_btn1) {
        this.exit_btn1 = false;
      }
    } else if (scrollTop === 0 && !this.exit_btn1) {
      this.exit_btn1 = true;
      if (this.exit_btn2) {
        this.exit_btn2 = false;
      }
    }
  }

  setPosition() {
    this.top_position = 100;
  }

  getDate(start) {
    return format(start, "DD MMM");
  }

  formatDate(start, end) {
    return (
      format(start, "dddd, MMM DD") +
      " from " +
      format(start, "H:mm") +
      " to " +
      format(end, "H:mm")
    );
  }

  show_popup_window(): void {
    this.showPopupWindow = true;
    this.appCommunicationService.collapseScrollOnPage("collapse");
    const self = this;
    const timer = setInterval(function() {
      if (self.layouts_container) {
        clearInterval(timer);
        self.containers = self.layouts_container.nativeElement.getElementsByClassName(
          "content-container"
        );
      }
    }, 100);
  }

  hide_all_layouts(): void {
    this.showEvent = false;
    this.showAssociation = false;
    this.showArchive = false;
    this.showFaq = false;
    this.showPage = false;
    this.showNews = false;
  }

  hide_popup_window(): void {
    this.top_position = 0;
    this.loading = false;
    this.exit_btn1 = true;
    this.exit_btn2 = false;
    this.show_page_not_found = false;
    this.page_data = null;
    this.appCommunicationService.collapseScrollOnPage("show");
    if (this.showPage || this.showFaq) {
      if (this.navigateBack) {
        this.location.back();
      }
    }
    if (this.showArchive) {
      if (this.lang === "sv") {
        this.location.go("sv/documents");
      } else {
        this.location.go("en/documents");
      }
    }
    if (this.showEvent) {
      if (this.navigateBack && !this.previousUrl) {
        this.location.back();
      } else if (this.navigateBack === undefined && !this.previousUrl) {
      } else {
        if (this.lang === "sv") {
          this.location.go("sv/events");
        } else {
          this.location.go("en/events");
        }
      }
    }
    if (this.showAssociation) {
      if (this.lang === "sv") {
        this.location.go("sv/list/");
        this.router.navigate(["sv/list"]);
      } else {
        this.location.go("en/list/");
        this.router.navigate(["en/list"]);
      }
    }
    if (this.showNews) {
      if (this.page_location === "home") {
        if (this.navigateBack) {
          this.location.back();
        }
      } else if (this.page_location === "news") {
        if (this.lang === "sv") {
          this.location.go("sv/news");
          this.router.navigate(["sv/news"]);
        } else {
          this.location.go("en/news");
          this.router.navigate(["en/news"]);
        }
      } else if (this.page_location === "offers") {
        if (this.lang === "sv") {
          this.router.navigate(["sv/offers"]);
        } else {
          this.router.navigate(["en/offers"]);
        }
      }
    }
    this.navigateBack = true;
    this.hide_all_layouts();
    this.showPopupWindow = false;
  }

  show_page_in_popup(slug): void {
    let lang = "";
    lang = this._cookieService.get("language");
    if (lang == undefined) {
      lang = this.lang;
    }
    this.loading = true;
    this.setPosition();
    this.showEvent = false;
    this.showPage = true;
    this.show_popup_window();
    this.pageSubscription = this.pagesService
      .getPageBySlug(slug, lang)
      .subscribe(
        res => {
          if (res) {
            this.page_data = res;
            this.page_data.content = this.sanitizeHtmlPipe.transform(
              this.page_data.content
            );
          } else {
            this.show_page_not_found = true;
          }

          this.loading = false;
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
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
      title: "Related associations",
      items: arg.relatedAssociations,
      displayed_item: arg.association
    };
    this.show_popup_window();
  }

  show_archive_in_popup(archive): void {
    this.archive = archive;
    this.showArchive = true;
    this.show_popup_window();
  }

  show_faq_in_popup(faq): void {
    this.faq = faq;
    this.showFaq = true;
    this.show_popup_window();
  }

  show_news_in_popup(article): void {
    this.news = article;
    this.showNews = true;
    this.show_popup_window();
  }

  unStringify(input) {
    return input
      .toLowerCase()
      .split("-")
      .map(i => i[0].toUpperCase() + i.substr(1))
      .join(" ");
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof RoutesRecognized)
      .subscribe(e => {
        if ((e as RoutesRecognized).state.root.firstChild.params) {
          this.previousUrl = (e as RoutesRecognized).state.root.firstChild.params.slug;
        }
      });

    this.showPopupWindow = false;
    this.appCommunicationService.collapseScrollOnPage("show");
    this.popup_window_updater = this.popupWindowCommunicationService.pageNotifyObservable$.subscribe(
      slug => {
        this.titleCommunicationService.setTitle(this.unStringify(slug));
        this.show_page_in_popup(slug);
      }
    );
    this.popup_window_event_updater = this.popupWindowCommunicationService.eventNotifyObservable$.subscribe(
      event => {
        this.loading = false;
        this.titleCommunicationService.setTitle(event.title);
        this.show_event_in_popup(event);
      }
    );
    this.popup_window_association_updater = this.popupWindowCommunicationService.associationNotifyObservable$.subscribe(
      arg => {
        this.loading = false;
        this.titleCommunicationService.setTitle(arg.association.title);
        this.show_association_in_popup(arg);
      }
    );
    this.popup_window_archive_updater = this.popupWindowCommunicationService.archiveNotifyObservable$.subscribe(
      archive => {
        this.loading = false;
        this.titleCommunicationService.setTitle(archive.title);
        this.show_archive_in_popup(archive);
      }
    );
    this.popup_window_faq_updater = this.popupWindowCommunicationService.faqNotifyObservable$.subscribe(
      faq => {
        this.loading = false;
        this.titleCommunicationService.setTitle(faq.question);
        this.show_faq_in_popup(faq);
      }
    );
    this.popup_window_hide_updater = this.popupWindowCommunicationService.hideNotifyObservable$.subscribe(
      arg => {
        this.titleCommunicationService.setTitle("THS - Student Union at KTH");
        if (this.showPopupWindow && arg.hidden === true) {
          this.navigateBack = arg.navigateBack;
          this.hide_popup_window();
        }
      }
    );
    this.popup_window_loader_updater = this.popupWindowCommunicationService.loaderNotifyObservable$.subscribe(
      () => {
        this.loading = true;
      }
    );
    this.popup_window_news_updater = this.popupWindowCommunicationService.newsNotifyObservable$.subscribe(
      arg => {
        this.loading = true;
        if (arg) {
          this.titleCommunicationService.setTitle(arg.article.title);
          this.loading = false;
          this.page_location = arg.page_location;
          this.show_news_in_popup(arg.article);
        } else {
          this.show_news_in_popup(arg);
        }
      }
    );
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
