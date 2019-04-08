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
      const arg = {
        hidden: true,
        navigateBack: false
      };
      this.popupWindowCommunicationService.hidePopup(arg);
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
      if (pos > 10 && !this.faqsFetched) {
        this.faqsFetched = true;
        this.faqCatSubscription = this.faqsService
          .getFAQs_OfEachCategories(1, this.lang)
          .subscribe(
            faqs => {
              this.showFAQSlider = true;
              this.faqs = faqs;
              //this.textSliderCommunicationService.send_data_to_textSlider(faqs);
            },
            error => {
              this.showFAQSlider = false;
              this.notificationBarCommunicationService.send_data(error);
            }
          );
        // this.showFAQSlider = true;
      }
    }
    if (!this.showNewsSlider) {
      if (pos > 10 && !this.newsFetched) {
        this.newsFetched = true;
        this.postsSubscription = this.postsService
          .getPosts(5, this.lang)
          .subscribe(
            posts => {
              this.showNewsSlider = true;
              this.news = posts;
              //this.imageSliderCommunicationService.send_data_to_imageSlider(posts);
            },
            error => {
              this.showNewsSlider = false;
              this.notificationBarCommunicationService.send_data(error);
            }
          );
        // this.showNewsSlider = true;
      }
    }
    if (!this.showSocialMediaCards) {
      if (pos > 10) {
        this.showSocialMediaCards = true;
      }
    }
    if (!this.showGoogleMap) {
      if (pos > 10) {
        this.showGoogleMap = true;
      }
    }
  }

  ngOnInit() {
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
