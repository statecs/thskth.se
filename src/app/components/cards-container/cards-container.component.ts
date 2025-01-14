import {
  Component,
  OnInit,
  Injector,
  OnDestroy,
  HostListener
} from "@angular/core";
import { CardsService } from "../../services/wordpress/cards.service";
import { Card } from "../../interfaces-and-classes/card";
import { CardCategorizerCardContainerService } from "../../services/component-communicators/card-categorizer-card-container.service";
import { Subscription } from "rxjs/Subscription";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as format from "date-fns/format";
import { GoogleCalendarService } from "../../services/google-calendar/google-calendar.service";
import { Event } from "../../interfaces-and-classes/event";
import { ths_calendars } from "../../utils/ths-calendars";
import { Location } from "@angular/common";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { RestaurantService } from "../../services/wordpress/restaurant.service";
import { RestrictionService } from "../../services/wordpress/restriction.service";
import { Restaurant } from "../../interfaces-and-classes/restaurant";
import * as _ from "lodash";

@Component({
  selector: "app-cards-container",
  templateUrl: "./cards-container.component.html",
  styleUrls: ["./cards-container.component.scss"]
})
export class CardsContainerComponent implements OnInit, OnDestroy {
  public cards: Card[];
  public standbyCards: Card[];
  public arranged_cards: Card[];
  public one_sixth_cards_array: Card[][];
  public one_third_half_array: Card[][];
  private cardsUpdater: Subscription;
  protected config: AppConfig;

  public events: any;
  public fetched_events: any;

  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_index: number;
  public selected_event_category: number;
  public ths_calendars: any[];
  public cardsLoaded: boolean;
  public lang: string;
  public paramsSubscription: Subscription;
  public cardsSubscription: Subscription;
  public eventsSubscription: Subscription;
  public restaurantUpdater: Subscription;
  public restrictionUpdater: Subscription;
  public deviceSize: number;
  public restaurant: Restaurant;
  public restriction: any;
  public date: Date;
  public dateDay: any;

  constructor(
    private cardsService: CardsService,
    private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
    private injector: Injector,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private googleCalendarService: GoogleCalendarService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private restaurantService: RestaurantService,
    private restrictionService: RestrictionService
  ) {
    this.config = injector.get(APP_CONFIG);
    this.selected_event_category = 0;
    this.ths_calendars = _.values(ths_calendars);
    this.cardsLoaded = false;
    this.lang = activatedRoute.snapshot.data["lang"];
    this.deviceSize = window.screen.width;
    this.date = new Date();
    this.dateDay = format(new Date(), "d");
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (this.standbyCards) {
      const pos = document.documentElement.scrollTop || document.body.scrollTop;
      if (pos > 200) {
        this.cards = this.cards.concat(this.standbyCards);
        this.standbyCards = null;
      }
    }
  }

  goToPage(link): void {
    if (
      link.substring(0, 7) === "http://" ||
      link.substring(0, 8) === "https://"
    ) {
      window.open(link, "_blank");
    } else {
      this.router.navigate([link]);
    }
  }

  showPage(window_type, slug_to_page): void {
    if (slug_to_page) {
      if (
        slug_to_page.substring(0, 7) === "http://" ||
        slug_to_page.substring(0, 8) === "https://"
      ) {
        if (window_type === "same-page") {
          window.open(slug_to_page, "_self");
        } else {
          window.open(slug_to_page, "_blank");
        }
      } else {
        if (window_type === "popup-window") {
          var last = slug_to_page.substring(
            slug_to_page.lastIndexOf("/") + 1,
            slug_to_page.length
          );
          this.popupWindowCommunicationService.showPageInPopup(last);
          this.location.go(slug_to_page);
        }

        if (this.lang === "sv") {
          slug_to_page =
            "sv" +
            (slug_to_page.substring(0, 1) === "/" ? "" : "/") +
            slug_to_page;
        } else {
          slug_to_page =
            "en" +
            (slug_to_page.substring(0, 1) === "/" ? "" : "/") +
            slug_to_page;
        }
        if (window_type === "new-tab") {
          window.open("/" + slug_to_page, "_blank");
        } else if (window_type === "same-page") {
          this.router.navigate(["/" + slug_to_page]);
        }
      }
    }
  }

  getBgUrl(card: any): string {
    let url = "";
    if (card.background_image !== "") {
      const image = card.background_image;
      if (this.deviceSize < 768) {
        url = image.image960;
      } else if (this.deviceSize >= 768 && this.deviceSize < 992) {
        url = image.image960;
      } else if (this.deviceSize >= 992 && this.deviceSize < 1200) {
        url = image.image1280;
      } else if (this.deviceSize >= 1200) {
        url = image.image1920;
      }
    }
    return url;
  }

  getBgUrl_thumbnail(card: any): string {
    let url = "";
    if (card.background_image !== "") {
      url = card.background_image.thumbnail;
    }
    return url;
  }

  changeBGColor(card: any): any {
    if (
      typeof card.background_color === "undefined" ||
      card.background_image !== ""
    ) {
      return { color: card.color };
    } else {
      return { "background-color": card.background_color, color: card.color };
    }
  }
  changeBGBColor(card: any): any {
    return { "background-color": "rgba(0, 0, 0, 0.27)", color: card.color };
  }

  displayCards(arg: any) {
    this.cardsLoaded = false;
    const self = this;
    self.arranged_cards = [];
    self.one_sixth_cards_array = [];
    self.one_third_half_array = [];
    this.cardsSubscription = this.cardsService
      .getCards(arg, this.lang)
      .subscribe(
        cards => {
          const pos =
            document.documentElement.scrollTop || document.body.scrollTop;
          if (pos > 200) {
            this.cards = cards;
            this.standbyCards = null;
          } else {
            this.cards = cards.slice(0, 4);
            this.standbyCards = cards.slice(4);
          }
          this.cardsLoaded = true;
        },
        error => {
          this.cardsLoaded = true;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  displayEventInPopup(event) {
    this.popupWindowCommunicationService.showEventInPopup(event);
    if (this.lang === "sv") {
      this.location.go("sv/events/" + this.stringify(event.title));
    } else {
      this.location.go("en/events/" + this.stringify(event.title));
    }
  }
  stringify(input) {
    return input
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  selectEvent(i) {
    this.selected_event_title = this.events[i].title;
    this.selected_event_text = this.events[i].description;
    this.selected_event_index = i;
  }

  getMonth(date): string {
    return format(date, "MMM");
  }

  getDay(date): string {
    return format(date, "DD");
  }

  formatDate(created_time): string {
    const date = new Date(created_time * 1000);
    return format(date, "DD MMM YYYY") + " at " + format(date, "hh:mma");
  }

  getDate(): string {
    return format(this.date, "D/M");
  }

  getDayIndex(): number {
    return parseInt(format(this.date, "d"), 10);
  }

  getWeekNumber(): string {
    return format(this.date, "W");
  }

  switchCalendar(calendarId, index) {
    this.selected_event_category = calendarId;
    let cal_Id = "";
    if (calendarId === null) {
      cal_Id = "all";
      this.getAllEvents();
    } else {
      this.getCalendar(calendarId);
      this.selected_event_category = index;
    }
  }

  getCalendar(calendarId): void {
    this.selected_event_title = "";
    this.selected_event_text = "";
    this.eventsSubscription = this.googleCalendarService
      .getUpcomingEvents(calendarId, 3)
      .subscribe(
        res => {
          this.events = res;
          if (res.length !== 0) {
            this.selected_event_title = res[0].title;
            this.selected_event_text = res[0].description;
          }
        },
        error => {
          this.events = [];
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach(event => {
      merged = merged.concat(event);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  getRestrictions(): void {
    this.restrictionUpdater = this.restrictionService
      .getRestrictions(this.lang)
      .subscribe(
        res => {
          this.restriction = res;
        },
        error => {
          this.restriction = null;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }
  getRestaurantMenu(): void {
    this.restaurantUpdater = this.restaurantService
      .getSingleRestaurant("nymble-restaurant", this.lang)
      .subscribe(
        res => {
          this.restaurant = res;
        },
        error => {
          this.restaurant = null;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  getAllEvents() {
    this.selected_event_category = -1;
    this.eventsSubscription = this.googleCalendarService
      .getAllEventsCard(null, "")
      .subscribe(
        res => {
          const mergedArrays = this.mergeArrays(res);
          const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
          if (sortedArrays.length > 5) {
            this.events = sortedArrays.slice(0, 5);

            if (res.length !== 0) {
              this.selected_event_title = sortedArrays[0].title;
              this.selected_event_text = sortedArrays[0].description;
            }
          } else {
            this.events = sortedArrays;

            if (res.length !== 0) {
              this.selected_event_title = sortedArrays[0].title;
              this.selected_event_text = sortedArrays[0].description;
            }
          }
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  fetchEvents(): void {
    this.getAllEvents();
  }

  ngOnInit() {
    this.selected_event_title = "";
    this.selected_event_text = "";
    this.selected_event_index = 0;
    this.selected_event_category = -1;
    this.fetchEvents();
    //this.fetchEvents();

    this.cardsUpdater = this.cardCategorizerCardContainerService.notifyObservable$.subscribe(
      arg => {
        this.displayCards(arg);
        this.fetchEvents();
      }
    );

    // this.getCalendar(ths_calendars.events.calendarId);
    this.getRestaurantMenu();
    this.getRestrictions();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
    if (this.cardsUpdater) {
      this.cardsUpdater.unsubscribe();
    }
    if (this.restaurantUpdater) {
      this.restaurantUpdater.unsubscribe();
    }
    if (this.restrictionUpdater) {
      this.restrictionUpdater.unsubscribe();
    }
  }
}
