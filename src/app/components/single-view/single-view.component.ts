import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Page } from "../../interfaces-and-classes/page";
import { PagesService } from "../../services/wordpress/pages.service";
import { ActivatedRoute, Params } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";

@Component({
  selector: "app-single-view",
  templateUrl: "./single-view.component.html",
  styleUrls: ["./single-view.component.scss"]
})
export class SingleViewComponent implements OnInit, OnDestroy {
  @Input() page: Page;
  private lang: string;
  public loading: boolean;
  public pageNotFound: boolean;
  public parent_slug: string;
  public slug: string;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public pageSubscription: Subscription;
  public pageSubscription2: Subscription;
  public pageSubscription3: Subscription;
  public parent_parent_slug: string;

  constructor(
    private pagesService: PagesService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService
  ) {
    this.loading = true;
    this.pageNotFound = false;
  }

  getParentParentPageBySlug() {
    this.pageSubscription = this.pagesService
      .getPageBySlug(this.parent_parent_slug, this.lang)
      .subscribe(
        page => {
          if (page) {
            this.getParentPageBySlug();
          } else {
            this.loading = false;
            this.pageNotFound = true;
          }
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getParentPageBySlug() {
    this.pageSubscription2 = this.pagesService
      .getPageBySlug(this.parent_slug, this.lang)
      .subscribe(
        page => {
          if (page) {
            this.getPageBySlug();
          } else {
            this.loading = false;
            this.pageNotFound = true;
          }
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getPageBySlug() {
    this.pageSubscription3 = this.pagesService
      .getPageBySlug(this.slug, this.lang)
      .subscribe(
        page => {
          this.loading = false;
          if (page) {
            this.page = page;
            this.titleCommunicationService.setTitle(page.name);
          } else {
            this.pageNotFound = true;
            if (this.lang === "sv") {
              this.titleCommunicationService.setTitle("Sidan hittades inte!");
            } else {
              this.titleCommunicationService.setTitle("Page not found!");
            }
          }
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        if (typeof params["single_page_slug"] === "undefined") {
          this.parent_slug = params["subpage"];
          this.slug = params["slug"];
        } else {
          this.parent_slug = params["slug"];
          this.slug = params["single_page_slug"];
        }
        this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe(
          (params2: Params) => {
            this.pageNotFound = false;
            this.lang = params2["lang"];
            if (typeof params["single_page_slug"] === "undefined") {
              this.lang = "en";
              this.parent_parent_slug = params["subpage"];
            } else {
              this.parent_parent_slug = params["subpage"];
            }
            if (typeof this.lang === "undefined") {
              this.lang = "en";
            }
            if (this.parent_parent_slug) {
              this.getParentParentPageBySlug();
            } else {
              this.getParentPageBySlug();
            }
          }
        );
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.pageSubscription2) {
      this.pageSubscription2.unsubscribe();
    }
    if (this.pageSubscription3) {
      this.pageSubscription3.unsubscribe();
    }
  }
}
