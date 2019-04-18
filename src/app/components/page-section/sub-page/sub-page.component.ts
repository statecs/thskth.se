import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  Input
} from "@angular/core";
import { PagesService } from "../../../services/wordpress/pages.service";
import { MenusService } from "../../../services/wordpress/menus.service";
import { Page } from "../../../interfaces-and-classes/page";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RemoveLangParamPipe } from "../../../pipes/remove-lang-param.pipe";
import { AddLangToSlugPipe } from "../../../pipes/add-lang-to-slug.pipe";
import { NotificationBarComponent } from "../../notification-bar/notification-bar.component";
import { NotificationBarCommunicationService } from "../../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { CookieService, CookieOptions } from "ngx-cookie";
import { MenuItem } from "../../../interfaces-and-classes/menu";
import { HrefToSlugPipe } from "../../../pipes/href-to-slug.pipe";
import { TitleCommunicationService } from "../../../services/component-communicators/title-communication.service";
import { HideUICommunicationService } from "../../../services/component-communicators/hide-ui-communication.service";
import * as format from "date-fns/format";
import { HeaderCommunicationService } from "../../../services/component-communicators/header-communication.service";
import { SanitizeHtmlPipe } from "../../../pipes/sanitizeHtml.pipe";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-sub-page",
  templateUrl: "./sub-page.component.html",
  styleUrls: ["./sub-page.component.scss"],
  providers: [NotificationBarComponent]
})
export class SubPageComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild("submenu_bar") submenu_bar: ElementRef;
  @ViewChild("submenuBarDropdown") submenuBarDropdown: ElementRef;
  public page: Page;
  public subMenu: MenuItem[];
  public slug: string;
  private lang: string;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  private hrefToSlugPipe: HrefToSlugPipe;
  public loading: boolean;
  public pageNotFound: boolean;
  public showSubmenuBarDropdown: boolean;
  public freeze_submenu_bar: boolean;
  private submenu_bar_pos: number;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public secondaryMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public pageSubscription: Subscription;
  public hideUISubscription: Subscription;
  public parent_slug: string;
  public show_single_page: boolean;
  public infoBoxClickCount: number;
  public notificationBarHeight: number;
  sanitizeHtmlPipe: SanitizeHtmlPipe;

  constructor(
    private pagesService: PagesService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _cookieService: CookieService,
    private menusService: MenusService,
    private notificationBarComponent: NotificationBarComponent,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private hideUICommunicationService: HideUICommunicationService,
    private headerCommunicationService: HeaderCommunicationService
  ) {
    this.loading = true;
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.showSubmenuBarDropdown = false;
    this.freeze_submenu_bar = false;
    this.subMenu = [];
    this.show_single_page = false;
    this.infoBoxClickCount = 0;
    this.notificationBarHeight = 0;
    this.sanitizeHtmlPipe = new SanitizeHtmlPipe(domSanitizer);
  }
  /*
  getOffsetTop(elem): number {
    let offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) ) {
        offsetTop += elem.offsetTop;
      }
    } while ( elem = elem.offsetParent );
    return offsetTop;
  }*/

  formatDate(created_time): string {
    return format(created_time, "YYYY-MM-DD");
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.toggle_freeze_submenu_bar();
  }

  toggle_freeze_submenu_bar() {
    const pos = document.documentElement.scrollTop || document.body.scrollTop;
    if (pos >= this.submenu_bar_pos) {
      if (!this.freeze_submenu_bar) {
        this.freeze_submenu_bar = true;
        this.submenu_bar.nativeElement.style.top =
          this.notificationBarHeight + "px";
      } else {
        this.submenu_bar.nativeElement.style.top =
          this.notificationBarHeight + "px";
        this.submenu_bar.nativeElement.style.width = "100%";
        this.submenu_bar.nativeElement.style.margin = "0";
        this.submenu_bar.nativeElement.style.borderRadius = "0px";
      }
    } else {
      if (this.freeze_submenu_bar) {
        this.freeze_submenu_bar = false;
        this.submenu_bar.nativeElement.style.top = "";
        this.submenu_bar.nativeElement.style.width = "";
        this.submenu_bar.nativeElement.style.margin = "";
        this.submenu_bar.nativeElement.style.borderRadius = "";
      }
    }
  }

  toggleSubmenuBarDropdown(): void {
    this.infoBoxClickCount += 1;
    this.showSubmenuBarDropdown
      ? this.hideDropdown()
      : (this.showSubmenuBarDropdown = true);
  }

  hideDropdown(): void {
    this.showSubmenuBarDropdown = false;
  }

  /*  goToPage(slug): void {
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      if (this.lang === 'sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }
  }*/

  goToPage(item): void {
    this.hideDropdown();
    let slug = "";
    if (item.type_label === "page") {
      slug = this.hrefToSlugPipe.transform(item.url);
      if (
        slug.substring(slug.length - 9) === "/?lang=en" ||
        slug.substring(slug.length - 9) === "/?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    } else if (item.type_label === "custom") {
      slug = item.url;

      if (
        slug.substring(0, 7) === "http://" ||
        slug.substring(0, 8) === "https://"
      ) {
        window.open(slug, "_blank");
      } else {
        if (
          slug.substring(slug.length - 9) === "/?lang=en" ||
          slug.substring(slug.length - 9) === "/?lang=sv"
        ) {
          slug = this.removeLangParamPipe.transform(slug);
        }
        if (
          slug.substring(slug.length - 8) === "?lang=en" ||
          slug.substring(slug.length - 8) === "?lang=sv"
        ) {
          slug = this.removeLangParamPipe.transform(slug);
        }
        slug = this.addLangToSlugPipe.transform(slug, this.lang);
        this.router.navigate([slug]);
      }
    } else if (item.type_label === "association") {
      slug = item.object_slug;
      if (
        slug.substring(slug.length - 9) === "/?lang=en" ||
        slug.substring(slug.length - 9) === "/?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      if (
        slug.substring(slug.length - 8) === "?lang=en" ||
        slug.substring(slug.length - 8) === "?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      this.router.navigate([
        "/" + this.lang + "/associations-and-chapters/" + slug
      ]);
    }
  }

  getSecondarySubMenu() {
    this.secondaryMenuSubscription = this.menusService
      .get_secondarySubMenu(this.parent_slug, this.slug, this.lang)
      .subscribe(
        submenu => {
          this.subMenu = submenu;
          if (this.subMenu.length === 0) {
            this.getSubmenuEmpty();
            this.getPageBySlug()
          }
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getSubmenuEmpty() {
    this.mainMenuSubscription = this.menusService
      .get_mainSubMenu(this.parent_slug, this.lang)
      .subscribe(
        submenu => {
          this.subMenu = submenu;
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getSubmenu() {
    this.mainMenuSubscription = this.menusService
      .get_mainSubMenu(this.slug, this.lang)
      .subscribe(
        submenu => {
          this.subMenu = submenu;
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getParentPageBySlug() {
    this.pageSubscription = this.pagesService
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
          this.pageNotFound = true;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getPageBySlug() {
    this.pageSubscription = this.pagesService
      .getPageBySlug(this.slug, this.lang)
      .subscribe(
        page => {
          this.loading = false;
          if (page) {
            this.page = page;
            if (page.content) {
              this.page.content = this.sanitizeHtmlPipe.transform(
                this.page.content
              );
            }
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
          this.pageNotFound = true;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        this.loading = true;
        this.slug = params["subpage"];
        if (typeof params["subpage"] === "undefined") {
          if (this._cookieService.get("language") == "sv") {
            this.lang = "sv";
            this.slug = params["lang"];
            this.getSubmenu();
            this.getPageBySlug();
          } else {
            this.lang = "en";
            this.slug = params["lang"];
            this.getSubmenu();
            this.getPageBySlug();
          }
        } else {
          this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe(
            (params2: Params) => {
              this.pageNotFound = false;
              if (params2["lang"] !== "en" && params2["lang"] !== "sv") {
                this.lang = "en";
                if (typeof params["slug"] === "undefined") {
                  this.slug = params["subpage"];
                  this.parent_slug = params2["lang"];
                  this.getSecondarySubMenu();
                  this.getParentPageBySlug();
                } else {
                  this.show_single_page = true;
                }
              } else {
                this.lang = params2["lang"];
                if (typeof params["slug"] === "undefined") {
                  this.slug = params["subpage"];
                  this.getSubmenu();
                  this.getPageBySlug();
                } else {
                  this.slug = params["slug"];
                  this.parent_slug = params["subpage"];
                  this.getSecondarySubMenu();
                  this.getParentPageBySlug();
                }
              }
            }
          );
        }
      }
    );

    this.hideUISubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(
      () => {
        if (this.infoBoxClickCount === 0) {
          if (this.submenuBarDropdown) {
            if (
              this.submenuBarDropdown.nativeElement !== event.target &&
              !this.submenuBarDropdown.nativeElement.contains(event.target)
            ) {
              this.hideDropdown();
            }
          }
          this.infoBoxClickCount += 1;
        } else {
          this.infoBoxClickCount = 0;
        }
      }
    );

    this.headerCommunicationService.positionHeaderObservable$.subscribe(
      height => {
        this.notificationBarHeight = height;
        this.toggle_freeze_submenu_bar();
      }
    );
  }

  ngAfterViewInit() {
    const self = this;
    setTimeout(function() {
      self.submenu_bar_pos = self.submenu_bar.nativeElement.offsetTop;
      self.toggle_freeze_submenu_bar();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
    if (this.secondaryMenuSubscription) {
      this.secondaryMenuSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.hideUISubscription) {
      this.hideUISubscription.unsubscribe();
    }
  }
}
