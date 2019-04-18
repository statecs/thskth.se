import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { TextSliderCommunicationService } from "../../services/component-communicators/text-slider-communication.service";
import { FaqsService } from "../../services/wordpress/faqs.service";
import { PostsService } from "../../services/wordpress/posts.service";
import { ImageSliderCommunicationService } from "../../services/component-communicators/image-slider-communication.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { CookieService } from "ngx-cookie";
import { SearchMenubarCommunicationService } from "../../services/component-communicators/search-menubar-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { PlatformLocation } from "@angular/common";
import { Post } from "../../interfaces-and-classes/post";
import { FAQ } from "../../interfaces-and-classes/faq";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("homePage") homePage: ElementRef;
  private lang: string;
  private langSelectFaq: string;
  private langSelectPosts: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public faqCatSubscription: Subscription;
  public postsSubscription: Subscription;
  public showGoogleMap: boolean;
  public showSocialMediaCards: boolean;
  public showFAQSlider: boolean;
  public showNewsSlider: boolean;
  public news: Post[] = [];
  public faqs: FAQ[] = [];
  private faqsFetched: boolean;
  private newsFetched: boolean;

  constructor(
    private textSliderCommunicationService: TextSliderCommunicationService,
    private faqsService: FaqsService,
    private router: Router,
    private postsService: PostsService,
    private imageSliderCommunicationService: ImageSliderCommunicationService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private _cookieService: CookieService,
    private searchMenubarCommunicationService: SearchMenubarCommunicationService,
    private _changeDetectionRef: ChangeDetectorRef,
    private headerCommunicationService: HeaderCommunicationService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private platformLocation: PlatformLocation
  ) {
    this.pageNotFound = false;
    this.lang = activatedRoute.snapshot.data["lang"];
    this.showGoogleMap = false;
    this.showSocialMediaCards = false;
    this.showFAQSlider = false;
    this.showNewsSlider = false;
    platformLocation.onPopState(() => {
      if (this.router.url.includes("/events")) {
        const arg = {
          hidden: true,
          navigateBack: false
        };
        this.popupWindowCommunicationService.hidePopup(arg);
      } else {
        const arg = {
          hidden: true
        };
        this.popupWindowCommunicationService.hidePopup(arg);
      }
    });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    const pos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (!this.showFAQSlider) {
      if (pos > 0 && !this.faqsFetched) {
        this.faqsFetched = true;
        if (
          localStorage.getItem("faq_list") &&
          this.langSelectFaq === this.lang
        ) {
          this.faqs = JSON.parse(localStorage.getItem("faq_list"));
          this.showFAQSlider = true;
        } else {
          this.langSelectFaq = this.lang;
          this.faqCatSubscription = this.faqsService
            .getFAQs_OfEachCategories(1, this.lang)
            .subscribe(
              faqs => {
                this.showFAQSlider = true;
                this.faqs = faqs;
                localStorage.setItem("faq_list", JSON.stringify(faqs));
              },
              error => {
                this.showFAQSlider = false;
                this.notificationBarCommunicationService.send_data(error);
              }
            );
        }
      }
    }
    if (!this.showNewsSlider) {
      if (pos > 100 && !this.newsFetched) {
        this.newsFetched = true;
        if (
          localStorage.getItem("posts_list") &&
          this.langSelectPosts === this.lang
        ) {
          this.news = JSON.parse(localStorage.getItem("posts_list"));
          this.showNewsSlider = true;
        } else {
          this.langSelectPosts = this.lang;
          this.postsSubscription = this.postsService
            .getPosts(4, this.lang)
            .subscribe(
              posts => {
                this.showNewsSlider = true;
                this.news = posts;
                localStorage.setItem("posts_list", JSON.stringify(posts));
              },
              error => {
                this.showNewsSlider = false;
                this.notificationBarCommunicationService.send_data(error);
              }
            );
        }
      }
    }
    if (!this.showSocialMediaCards) {
      if (pos > 150) {
        this.showSocialMediaCards = true;
      }
    }
    if (!this.showGoogleMap) {
      if (pos > 200) {
        this.showGoogleMap = true;
      }
    }
  }

  ngOnInit() {
    this.titleCommunicationService.setTitle("THS - Student Union at KTH");

    if (this._cookieService.get("language") === "sv") {
      this.router.navigate(["/sv"]);
    } else {
      this.router.navigate(["/en"]);
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.faqCatSubscription) {
      this.faqCatSubscription.unsubscribe();
    }
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
