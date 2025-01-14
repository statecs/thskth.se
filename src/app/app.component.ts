import {
  Component,
  ElementRef,
  ViewChild,
  Inject,
  OnInit
} from "@angular/core";
import { AppCommunicationService } from "./services/component-communicators/app-communication.service";
import { DOCUMENT } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { TitleCommunicationService } from "./services/component-communicators/title-communication.service";
import { HideUICommunicationService } from "./services/component-communicators/hide-ui-communication.service";
import { HeaderCommunicationService } from "./services/component-communicators/header-communication.service";
import { CookieService } from "ngx-cookie";
import { Location, PopStateEvent } from "@angular/common";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
declare let ga: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("page") page: ElementRef;

  private scrollTop: number;
  public online: boolean = navigator.onLine;
  public no_internet: boolean;
  public header_position: number;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    private appCommunicationService: AppCommunicationService,
    @Inject(DOCUMENT) private document: Document,
    private hideUICommunicationService: HideUICommunicationService,
    private titleService: Title,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService,
    private _cookieService: CookieService,
    public router: Router,
    private location: Location
  ) {
    window.addEventListener("online", () => {
      this.online = true;
    });
    window.addEventListener("offline", () => {
      this.online = false;
    });
    this.checkInternet();
    this.appCommunicationService.notifyObservable$.subscribe(arg => {
      if (this.page) {
        const pageStyle = this.page.nativeElement.style;
        if (arg === "collapse") {
          document.body.style.overflow = "hidden";
        } else if (arg === "show") {
          document.body.style.overflow = "auto";
        }
      }
    });
    this.titleCommunicationService.notifyObservable$.subscribe(title => {
      this.setTitle(title);
    });
    this.headerCommunicationService.positionHeaderObservable$.subscribe(arg => {
      this.header_position = arg;
      this.page.nativeElement.style.top = arg + "px";
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga("set", "page", event.urlAfterRedirects);
        ga("send", "pageview");
      }
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  checkInternet(): void {
    if (!this.online) {
      this.no_internet = true;
    } else {
      this.no_internet = false;
    }
  }

  hideOverlappingUI(event: any): void {
    this.checkInternet();
    this.hideUICommunicationService.hideOverlappingElements(event);
  }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        if (ev.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (ev instanceof NavigationEnd) {
        if (ev.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
  }
}
