import { Component, OnDestroy, OnInit } from "@angular/core";
import { PagesService } from "../../../services/wordpress/pages.service";
import { MenusService } from "../../../services/wordpress/menus.service";
import { Page } from "../../../interfaces-and-classes/page";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RemoveLangParamPipe } from "../../../pipes/remove-lang-param.pipe";
import { AddLangToSlugPipe } from "../../../pipes/add-lang-to-slug.pipe";
import { NotificationBarCommunicationService } from "../../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { HrefToSlugPipe } from "../../../pipes/href-to-slug.pipe";
import { TitleCommunicationService } from "../../../services/component-communicators/title-communication.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit, OnDestroy {
  public page: Page;
  public subMenu: any;
  public slug: string;
  private lang: string;
  public showSubmenuBarDropdown: boolean;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public paramsSubscription: Subscription;
  public secondarySubMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public pageSubscription: Subscription;
  private hrefToSlugPipe: HrefToSlugPipe;

  constructor(
    private pagesService: PagesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private menusService: MenusService,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService
  ) {
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.showSubmenuBarDropdown = false;
  }

  goToPage(item): void {
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
      this.router.navigate(["/" + this.lang + "/list/" + slug]);
    }
  }

  toggleSubmenuBarDropdown(): void {
    this.showSubmenuBarDropdown
      ? this.hideDropdown()
      : (this.showSubmenuBarDropdown = true);
  }

  hideDropdown(): void {
    this.showSubmenuBarDropdown = false;
  }

  getSecondarySubMenu() {
    this.secondarySubMenuSubscription = this.menusService
      .get_secondarySubMenu("contact", this.slug, this.lang)
      .subscribe(
        submenu => {
          this.subMenu = submenu;
        },
        error => {
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
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getPageBySlug() {
    this.pageSubscription = this.pagesService
      .getPageBySlug(this.slug, this.lang)
      .subscribe(
        page => {
          this.page = page;
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.slug = params["slug"];
        if (typeof this.slug === "undefined") {
          this.slug = "contact";
        }
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        }
        if (this.lang === "sv") {
          this.titleCommunicationService.setTitle("Kontakta oss");
        } else {
          this.titleCommunicationService.setTitle("Contact");
        }
        this.getPageBySlug();
        if (this.slug !== "contact" && this.slug !== "faq") {
          this.getSecondarySubMenu();
        } else {
          this.getSubmenu();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.secondarySubMenuSubscription) {
      this.secondarySubMenuSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }
}
