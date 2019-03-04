import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { RestaurantService } from "../../services/wordpress/restaurant.service";
import {
  Restaurant,
  DishesTime
} from "../../interfaces-and-classes/restaurant";
import { ActivatedRoute, Params } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import * as format from "date-fns/format";

@Component({
  selector: "app-restaurants",
  templateUrl: "./restaurants.component.html",
  styleUrls: ["./restaurants.component.scss"]
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  @ViewChild("slides_container") slides_container: ElementRef;
  @ViewChild("slider_progress_bar") slider_progress_bar: ElementRef;
  @ViewChild("slides_wrapper") slides_wrapper: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  public restaurants: Restaurant[];
  public restaurant_index: number;
  public showSchedule: boolean;
  public selected_day: string;
  public today: any;
  private lang: string;
  public pageNotFound: boolean;
  private loading: boolean;
  private swipeCoord: [number, number];
  private swipeTime: number;
  public item_onfocus_index: number;
  public paramsSubscription: Subscription;
  public restaurantSubscription: Subscription;
  public menuFullText: string;
  public date: Date;

  constructor(
    private restaurantService: RestaurantService,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService
  ) {
    this.loading = true;
    this.slideIndex = 0;
    this.showSchedule = false;
    this.today = new Date();
    this.selected_day = format(new Date(), "dddd");
    if (this.selected_day === "Sunday" || this.selected_day === "Saturday") {
      this.selected_day = "Monday";
    }
    this.item_onfocus_index = 0;
    this.date = new Date();
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [
      e.changedTouches[0].pageX,
      e.changedTouches[0].pageY
    ];
    const time = new Date().getTime();

    if (when === "start") {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === "end") {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1]
      ];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 && // Short enough
        Math.abs(direction[1]) < Math.abs(direction[0]) && // Horizontal enough
        Math.abs(direction[0]) > 30
      ) {
        // Long enough
        if (direction[0] < 0) {
          if (this.item_onfocus_index < this.restaurants.length - 1) {
            this.item_onfocus_index += 1;
            this.swipeForward();
            this.restaurant_index = this.item_onfocus_index;
            this.updateDishes();
          }
        } else {
          if (this.item_onfocus_index > 0) {
            this.item_onfocus_index -= 1;
            this.swipeBackward();
            this.restaurant_index = this.item_onfocus_index;
            this.updateDishes();
          }
        }
      }
    }
  }

  swipeForward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = "";
    if (slides_wrapper.style.marginLeft) {
      margin_left = parseFloat(slides_wrapper.style.marginLeft) - 85 + "%";
    } else {
      margin_left = "-79%";
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  swipeBackward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = "";
    if (slides_wrapper.style.marginLeft) {
      margin_left = parseFloat(slides_wrapper.style.marginLeft) + 85 + "%";
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  getWeekNumber(): string {
    return format(this.date, "W");
  }

  changeDay(day) {
    this.selected_day = day;
    this.updateDishes();
  }

  showRestaurant(index: number) {
    this.restaurant_index = index;
    this.showSchedule = true;
    this.updateDishes();
    this.titleCommunicationService.setTitle(
      this.restaurants[this.restaurant_index].title
    );
  }

  updateDishes() {
    let day_index: number;
    if (this.selected_day === "Monday") {
      day_index = 0;
    } else if (this.selected_day === "Tuesday") {
      day_index = 1;
    } else if (this.selected_day === "Wednesday") {
      day_index = 2;
    } else if (this.selected_day === "Thursday") {
      day_index = 3;
    } else if (this.selected_day === "Friday") {
      day_index = 4;
    }
    if (this.restaurant_index) {
      if (this.restaurants[this.restaurant_index].menu.length > 0) {
        this.menuFullText = this.restaurants[this.restaurant_index].menu[
          day_index
        ].full_text;
      } else {
        this.menuFullText = null;
      }
    } else {
      if (this.restaurants[this.item_onfocus_index].menu.length > 0) {
        this.menuFullText = this.restaurants[this.item_onfocus_index].menu[
          day_index
        ].full_text;
      } else {
        this.menuFullText = null;
      }
    }
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        this.loading = true;
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.pageNotFound = true;
          this.lang = "en";
        }
        this.restaurantSubscription = this.restaurantService
          .getRestaurants(this.lang)
          .subscribe(
            res => {
              this.loading = false;
              this.restaurants = res;
              this.updateDishes();
              if (this.restaurant_index) {
                this.titleCommunicationService.setTitle(
                  this.restaurants[this.restaurant_index].title
                );
              } else {
                if (this.lang === "sv") {
                  this.titleCommunicationService.setTitle(
                    "Restaurang och Café"
                  );
                } else {
                  this.titleCommunicationService.setTitle(
                    "Restaurants and Cafees"
                  );
                }
              }
            },
            error => {
              this.loading = false;
              this.notificationBarCommunicationService.send_data(error);
            }
          );
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.restaurantSubscription) {
      this.restaurantSubscription.unsubscribe();
    }
  }
}
