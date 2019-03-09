import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { SearchMenubarCommunicationService } from "../../services/component-communicators/search-menubar-communication.service";
import { MenusService } from "../../services/wordpress/menus.service";
import { MenuItem } from "../../interfaces-and-classes/menu";
import { ths_chapters } from "../../utils/ths-chapters";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { RemoveLangParamPipe } from "../../pipes/remove-lang-param.pipe";
import { AddLangToSlugPipe } from "../../pipes/add-lang-to-slug.pipe";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { HrefToSlugPipe } from "../../pipes/href-to-slug.pipe";
import { HideUICommunicationService } from "../../services/component-communicators/hide-ui-communication.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("app_header") app_header: ElementRef;
  @ViewChild("menuDropdown") menuDropdown: ElementRef;
  @ViewChild("chaptersMobile") chaptersMobile: ElementRef;
  @ViewChild("chapter_icon") chapter_icon: ElementRef;
  @ViewChild("submenu_item") submenu_item: ElementRef;
  private topLevelMainMenu: MenuItem[];
  public showMenuMobile: boolean;
  public showChaptersMobile: boolean;
  public ths_chapters: object[];
  public placeholder: string;
  public lang: string;
  public subMenu: MenuItem[];
  public subMenu_slug: string;
  public subMenu2: MenuItem[];
  private showSubmenuIndex: number;
  private showSubmenuIndex2: number;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  private hrefToSlugPipe: HrefToSlugPipe;
  public paramsSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public topLevelMenuSubscription: Subscription;
  public headerSubscription: Subscription;
  public menuSubscription: Subscription;
  public hideOverlappingUIsSubscription: Subscription;
  public searchTerm: string;
  public language_img: string;
  public signin_text: string;
  public chapter_text: string;
  public language_text: string;
  public headerPosition: number;
  public tranparentHeader: boolean;
  public menu_clickCount: number;
  public chapters_clickCount: number;

  constructor(
    private headerCommunicationService: HeaderCommunicationService,
    private searchMenubarCommunicationService: SearchMenubarCommunicationService,
    private menusService: MenusService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private hideUICommunicationService: HideUICommunicationService
  ) {
    this.showMenuMobile = false;
    this.showChaptersMobile = false;
    this.ths_chapters = ths_chapters;
    this.subMenu = [];
    this.subMenu2 = [];
    this.searchTerm = "";
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.topLevelMainMenu = [];
    this.tranparentHeader = true;
    localStorage.clear();
    this.menu_clickCount = 0;
    this.chapters_clickCount = 0;
    this.showSubmenuIndex = -1;
    this.showSubmenuIndex2 = -1;
  }

  toggleSubmenu(object_slug, i): void {
    if (this.showSubmenuIndex < 0 || this.showSubmenuIndex === null) {
      this.showSubMenu(object_slug, i);
    } else if (this.showSubmenuIndex === i) {
      this.hideSubMenu(i);
    } else if (this.showSubmenuIndex !== i) {
      this.showSubMenu(object_slug, i);
    }
  }

  toggleSubmenu2(object_slug, i): void {
    if (this.showSubmenuIndex2 < 0 || this.showSubmenuIndex2 === null) {
      this.showSubMenu2(object_slug, i);
    } else if (this.showSubmenuIndex2 === i) {
      this.hideSubMenu2(i);
    } else if (this.showSubmenuIndex2 !== i) {
      this.showSubMenu2(object_slug, i);
    }
  }

  goToHome(): void {
    if (this.showChaptersMobile) {
      this.chapter_icon.nativeElement.style.transform = "rotate(0deg)";
      this.showChaptersMobile = false;
    }
    if (this.showMenuMobile) {
      this.showMenuMobile = false;
    }
  }

  openInNewTab(link): void {
    window.open(link, "_blank");
  }

  toggleChaptersMobile(event): void {
    this.chapters_clickCount += 1;
    this.showChaptersMobile === true
      ? (this.showChaptersMobile = false)
      : (this.showChaptersMobile = true);
    if (this.showChaptersMobile) {
      event.target.style.transform = "rotate(90deg)";
      this.showMenuMobile = false;
    } else {
      event.target.style.transform = "rotate(0deg)";
    }
  }

  toggleMenuMobile(): void {
    this.menu_clickCount += 1;
    this.showMenuMobile === true
      ? (this.showMenuMobile = false)
      : (this.showMenuMobile = true);
    if (this.showMenuMobile) {
      this.showChaptersMobile = false;
      this.chapter_icon.nativeElement.style.transform = "rotate(0deg)";
    }
  }

  showSearchMenubar(): void {
    this.searchMenubarCommunicationService.showSearchMenubar();
  }

  expendHeader() {
    this.app_header.nativeElement.style.top = "0px";
  }

  collapseHeader() {
    this.app_header.nativeElement.style.top = "-150px";
  }

  setPlaceholder(): void {
    if (this.lang === "sv") {
      this.placeholder = "Sök";
    } else {
      this.placeholder = "Search";
    }
  }

  showSubMenu(id, index) {
    this.subMenu = [];
    this.subMenu2 = [];
    this.showSubmenuIndex = index;
    this.showSubmenuIndex2 = -1;
    this.subMenu_slug = id;
    this.mainMenuSubscription = this.menusService
      .get_mainSubMenu(id, this.lang)
      .subscribe(
        subMenu => {
          this.subMenu = subMenu;
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  showSubMenu2(id, index) {
    this.subMenu2 = [];
    this.showSubmenuIndex2 = index;
    this.mainMenuSubscription = this.menusService
      .get_secondarySubMenu(this.subMenu_slug, id, this.lang)
      .subscribe(
        subMenu => {
          this.subMenu2 = subMenu;
          if (this.subMenu2.length === 0) {
            this.showSubmenuIndex2 = -1;
          }
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  submitSearch(event) {
    if (event.keyCode === 13) {
      this.navToSearchPage("/search");
    }
  }

  navToSearchPage(url): void {
    this.showMenuMobile = false;
    if (this.lang === "en") {
      this.router.navigateByUrl("/en" + url + "?q=" + this.searchTerm);
    } else if (this.lang === "sv") {
      this.router.navigateByUrl("/sv" + url + "?q=" + this.searchTerm);
    }
  }

  hideSubMenu(i): void {
    this.showSubmenuIndex = -1;
  }

  hideSubMenu2(i): void {
    this.showSubmenuIndex2 = -1;
  }

  switchLanguage() {
    if (this.lang === "en") {
      this.lang = "sv";
    } else if (this.lang === "sv") {
      this.lang = "en";
    }
  }

  changeLanguage() {
    this.switchLanguage();
    this.displayActualLanguage();
    this.getTopLevelMenu();
    const lang = this.activatedRoute.snapshot.params["lang"];
    if (typeof lang === "undefined" || (lang !== "en" && lang !== "sv")) {
      let url = this.router.url;
      if (
        this.router.url === "/en" ||
        this.router.url === "/sv" ||
        this.router.url === "/sv/" ||
        this.router.url === "/en/" ||
        this.router.url === "/"
      ) {
        url = "";
      }
      if (url.substring(0, 4) === "/sv/" || url.substring(0, 4) === "/en/") {
        if (url.substring(0, 4) === "/sv/") {
          this.router.navigateByUrl("/en/" + url.substring(4));
        } else if (url.substring(0, 4) === "/en/") {
          this.router.navigateByUrl("/sv/" + url.substring(4));
        } else {
          this.router.navigateByUrl("/sv/" + url.substring(1));
        }
      } else {
        if (this.lang === "en") {
          this.router.navigateByUrl("/en" + url);
        } else if (this.lang === "sv") {
          this.router.navigateByUrl("/sv" + url);
        }
      }
    } else {
      if (this.lang === "en") {
        this.router.navigateByUrl("/en" + this.router.url.substring(3));
      } else if (this.lang === "sv") {
        this.router.navigateByUrl("/sv" + this.router.url.substring(3));
      }
    }
  }

  getTopLevelMenu(): void {
    this.topLevelMainMenu = [];
    this.topLevelMenuSubscription = this.menusService
      .getTopLevel_mainMenu(this.lang)
      .subscribe(
        res => {
          this.topLevelMainMenu = res;
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  goToPage(item): void {
    this.showSubmenuIndex = null;
    this.showMenuMobile = false;
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

  displayActualLanguage() {
    if (this.lang === "en" || typeof this.lang === "undefined") {
      this.language_text = "Svenska";
      this.language_img = "../../../assets/images/sweden_flag.png";
      this.signin_text = "Sign in";
      this.chapter_text = "Chapters";
    } else if (this.lang === "sv") {
      this.language_text = "English";
      this.language_img = "../../../assets/images/British_flag.png";
      this.signin_text = "Logga in";
      this.chapter_text = "Sektioner";
    }
  }

  ngOnInit() {
    this.headerSubscription = this.headerCommunicationService.positionHeaderObservable$.subscribe(
      arg => {
        this.headerPosition = arg;
        this.app_header.nativeElement.style.marginTop = arg + "px";
      }
    );

    this.headerSubscription = this.headerCommunicationService.tranparentHeaderObservable$.subscribe(
      arg => {
        if (arg) {
          this.tranparentHeader = true;
        } else {
          this.tranparentHeader = false;
        }
      }
    );
    this.lang = this.activatedRoute.snapshot.data["lang"];
    if (typeof this.lang === "undefined") {
      this.paramsSubscription = this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.lang = params["lang"];
          if (typeof this.lang === "undefined") {
            this.lang = "en";
          } else if (this.lang !== "en" && this.lang !== "sv") {
            this.lang = "en";
          }
          this.setPlaceholder();
          this.getTopLevelMenu();
        }
      );
    } else {
      this.setPlaceholder();
      this.getTopLevelMenu();
    }

    this.displayActualLanguage();
    this.headerSubscription = this.headerCommunicationService.notifyObservable$.subscribe(
      arg => {
        if (arg === "expend") {
          this.expendHeader();
        } else if (arg === "collapse") {
          this.collapseHeader();
        }
      }
    );

    this.menuSubscription = this.headerCommunicationService.menuObservable$.subscribe(
      () => {
        this.showMenuMobile = false;
      }
    );

    /*this.hideOverlappingUIsSubscription = this.hideUICommunicationService.hideUIObservable$.subscribe((event) => {
      if (this.menu_clickCount === 0 && this.submenu_item) {
        console.log(event.target);
        console.log(this.menuDropdown.nativeElement);
        console.log(this.menuDropdown.nativeElement !== event.target);
        console.log(this.submenu_item.nativeElement.contains(event.target));
        const plus_minus_btns = this.submenu_item.nativeElement.getElementsByClassName('fa');
        if (this.menuDropdown.nativeElement !== event.target && !this.menuDropdown.nativeElement.contains(event.target)) {
          let matched = false;
          let count = 0;
          for (const btn of plus_minus_btns) {
            console.log(btn);
            if (btn === event.target) {
              console.log("matched");
              matched = true;
            }
            count += 1;
            if ( plus_minus_btns.length === count - 1 && !matched) {
              this.showMenuMobile = false;
              this.menu_clickCount += 1;
            }
          }

        }
      }else {
        this.menu_clickCount = 0;
      }

      if (this.chapters_clickCount === 0 && this.chaptersMobile) {
        if (this.chaptersMobile.nativeElement !== event.target && !this.chaptersMobile.nativeElement.contains(event.target)) {
          this.showChaptersMobile = false;
          this.chapter_icon.nativeElement.style.transform = 'rotate(0deg)';
          this.chapters_clickCount += 1;
        }
      }else {
        this.chapters_clickCount = 0;
      }
    });*/
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
    if (this.topLevelMenuSubscription) {
      this.topLevelMenuSubscription.unsubscribe();
    }
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
