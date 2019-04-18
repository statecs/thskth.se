import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { PostsService } from "../../services/wordpress/posts.service";
import { Post } from "../../interfaces-and-classes/post";
import * as format from "date-fns/format";
import { Location } from "@angular/common";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit, OnDestroy {
  public lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public fetchMorePostsSub: Subscription;
  public posts: Post[];
  public slug: string;
  public fetching: boolean;
  public moreDocumentsExist = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private router: Router,
    private location: Location,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService,
    private notificationBarCommunicationService: NotificationBarCommunicationService
  ) {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        this.lang = params["lang"];
        this.slug = params["slug"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.pageNotFound = true;
          this.lang = "en";
        }
        if (this.lang === "sv") {
          this.titleCommunicationService.setTitle("Nyheter");
        } else {
          this.titleCommunicationService.setTitle("News");
        }
      }
    );
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (this.posts && !this.fetching && this.moreDocumentsExist) {
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
    this.fetching = true;
    const lastPostDate = this.posts[this.posts.length - 1].published_date;
    if (this.fetchMorePostsSub) {
      this.fetchMorePostsSub.unsubscribe();
    }
    this.fetchMorePostsSub = this.postsService
      .getPostsBySinceDateTime(15, this.lang, lastPostDate)
      .subscribe(
        res => {
          this.posts = this.posts.concat(res);
          this.fetching = false;
          if (!res.length) {
            this.moreDocumentsExist = false;
          }
        },
        error => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  goToPage(item, slug): void {
    const arg = {
      article: item,
      page_location: "news"
    };

    this.popupWindowCommunicationService.showNewsInPopup(arg);
    if (this.lang === "sv") {
      this.location.go("sv/news/" + slug);
    } else {
      this.location.go("en/news/" + slug);
    }
  }

  formatDate(date) {
    return format(date, "MMM DD");
  }

  showArticleInPopup(): void {
    this.popupWindowCommunicationService.showNewsInPopup(null);
    this.postsService.getPostBySlug(this.slug, this.lang).subscribe(res => {
      const arg = {
        article: res,
        page_location: "news"
      };
      this.popupWindowCommunicationService.showNewsInPopup(arg);
    });
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.paramsSubscription2 = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.slug = params["slug"];
        if (this.slug) {
          this.showArticleInPopup();
        } else {
          this.postsService.getPosts(15, this.lang).subscribe(res => {
            this.posts = res;
          });
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.paramsSubscription2) {
      this.paramsSubscription2.unsubscribe();
    }
    if (this.fetchMorePostsSub) {
      this.fetchMorePostsSub.unsubscribe();
    }
  }
}
