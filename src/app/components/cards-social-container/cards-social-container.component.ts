import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy
} from "@angular/core";
import { Card } from "../../interfaces-and-classes/card";
import { SocialMediaPostService } from "../../services/social-media-post/social-media-post.service";
import { SocialMediaPost } from "../../interfaces-and-classes/social_media_post";
import * as format from "date-fns/format";
import { CookieService, CookieOptions } from "ngx-cookie";
import { Event } from "../../interfaces-and-classes/event";
import { ths_calendars, THSCalendar } from "../../utils/ths-calendars";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import {
  CardsSocialContainerComponentService,
  CardsSocialContainerViewModel
} from "./cards-social-container.component.service";

@Component({
  selector: "app-cards-social-container",
  templateUrl: "./cards-social-container.component.html",
  styleUrls: ["./cards-social-container.component.scss"],
  providers: [CardsSocialContainerComponentService]
})
export class CardsSocialContainerComponent implements OnInit, OnDestroy {
  @Input() showFetchMoreBtn: boolean;
  public cards: Card[];
  public viewModel: CardsSocialContainerViewModel;
  public showEventCalendar: boolean;
  public events: Event[];
  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_index: number;
  public ths_calendars: { [key: string]: THSCalendar };
  public existMorePosts: boolean;
  public lang: string;
  public read_more: string;
  public paramsSubscription: Subscription;
  public postsSubscription: Subscription;

  constructor(
    private viewModelService: CardsSocialContainerComponentService,
    private _cookieService: CookieService,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.showEventCalendar = false;
    this.ths_calendars = ths_calendars;
    this.existMorePosts = true;
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
    //this.lang = this.activatedRoute.snapshot.data["lang"];
    if (typeof this.lang === "undefined") {
      this.paramsSubscription = this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.lang = params["lang"];
          if (typeof this.lang === "undefined") {
            this.lang = "en";
          } else if (this.lang !== "en" && this.lang !== "sv") {
            this.lang = "en";
          }
          this.lang === "en"
            ? (this.read_more = "Read more")
            : (this.read_more = "Läs Mer");
        }
      );
    } else {
      this.lang === "en"
        ? (this.read_more = "Read more")
        : (this.read_more = "Läs Mer");
    }
  }

  ngOnInit() {
    this.selected_event_title = "";
    this.selected_event_text = "";
    this.selected_event_index = 0;
    this.postsSubscription = this.viewModelService.getData().subscribe(
      viewModel => {
        this.viewModel = viewModel;
      },
      error => {
        this.notificationBarCommunicationService.send_data(error);
      }
    );
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (!this.showFetchMoreBtn && this.viewModel.meta_data) {
      const pos =
        (document.documentElement.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      const max = document.documentElement.scrollHeight;
      if (pos > max - 500) {
        this.fetchMorePosts();
      }
    }
  }

  fetchMorePosts(): void {
    this.viewModel.fetching = true;
    this.viewModel.displayedCards_amount += 6;
    this.viewModel.socialMediaPosts = this.viewModel.meta_data.slice(
      0,
      this.viewModel.displayedCards_amount
    );
    if (
      this.viewModel.displayedCards_amount >= this.viewModel.meta_data.length
    ) {
      this.existMorePosts = false;
    }
    this.viewModel.fetching = false;
  }

  formatDate(created_time): string {
    const date = created_time;
    return format(date, "DD MMM YYYY") + " at " + format(date, "hh:mma");
  }

  goToUserProfile(url): void {
    window.open(url, "_blank");
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
