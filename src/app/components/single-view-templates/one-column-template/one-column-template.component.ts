import {
  Component,
  OnInit,
  Input,
  HostListener,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Page } from "../../../interfaces-and-classes/page";
import * as format from "date-fns/format";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { SanitizeHtmlPipe } from "../../../pipes/sanitizeHtml.pipe";
import { MenusService } from "../../../services/wordpress/menus.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";
import { HrefToSlugPipe } from "../../../pipes/href-to-slug.pipe";
import { MenuItem } from "../../../interfaces-and-classes/menu";
import { RemoveLangParamPipe } from "../../../pipes/remove-lang-param.pipe";
import { AddLangToSlugPipe } from "../../../pipes/add-lang-to-slug.pipe";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-one-column-template",
  templateUrl: "./one-column-template.component.html",
  styleUrls: ["./one-column-template.component.scss"]
})
export class OneColumnTemplateComponent implements OnInit {
  @ViewChild("submenu_bar") submenu_bar: ElementRef;
  page_data: Page;
  private submenu_bar_pos: number;
  public freeze_submenu_bar: boolean;
  public slug: string;
  public parent_slug: string;
  private lang: string;
  public subMenu: MenuItem[];
  public showSubmenuBarDropdown: boolean;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public secondaryMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public paramsSubscription: Subscription;
  sanitizeHtmlPipe: SanitizeHtmlPipe;
  private hrefToSlugPipe: HrefToSlugPipe;

  @Input("page_data") set pageData(page: Page) {
    page.content = this.sanitizeHtmlPipe.transform(page.content);
    this.page_data = page;
  }

  formatDate(created_time): string {
    return format(created_time, "YYYY-MM-DD");
  }

  constructor(
    private domSanitizer: DomSanitizer,
    private menusService: MenusService,
    private _cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.sanitizeHtmlPipe = new SanitizeHtmlPipe(domSanitizer);
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.showSubmenuBarDropdown = false;
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.toggle_freeze_submenu_bar();
  }

  toggle_freeze_submenu_bar() {
    const pos = document.documentElement.scrollTop || document.body.scrollTop;
    if (pos >= 110) {
      if (!this.freeze_submenu_bar) {
        this.freeze_submenu_bar = true;
        /* this.submenu_bar.nativeElement.style.top =
          this.notificationBarHeight + "px";*/
      } else {
        /*   this.submenu_bar.nativeElement.style.top =
          this.notificationBarHeight + "px";*/
        this.submenu_bar.nativeElement.style.width = "100%";
        this.submenu_bar.nativeElement.style.margin = "0";
        this.submenu_bar.nativeElement.style.borderRadius = "0px";
      }
    } else {
      if (this.freeze_submenu_bar) {
        this.freeze_submenu_bar = false;
        this.submenu_bar.nativeElement.style.top = "0";
        this.submenu_bar.nativeElement.style.width = "";
        this.submenu_bar.nativeElement.style.margin = "";
        this.submenu_bar.nativeElement.style.borderRadius = "";
      }
    }
  }

  toggleSubmenuBarDropdown(): void {
    //this.infoBoxClickCount += 1;
    this.showSubmenuBarDropdown
      ? this.hideDropdown()
      : (this.showSubmenuBarDropdown = true);
  }

  hideDropdown(): void {
    this.showSubmenuBarDropdown = false;
  }
  getSubmenu() {
    this.mainMenuSubscription = this.menusService
      .get_secondarySubMenu(this.parent_slug, this.slug, this.lang)
      .subscribe(
        submenu => {
          this.subMenu = submenu;
        },
        error => {
          //this.loading = false;
          //  this.notificationBarCommunicationService.send_data(error);
        }
      );
  }
  goToPage(item): void {
    this.hideDropdown();
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
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

  ngOnInit() {
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }

    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parent_slug = params["subpage"];
        this.slug = params["slug"];
        this.getSubmenu();
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
    if (this.secondaryMenuSubscription) {
      this.secondaryMenuSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
  }
}
