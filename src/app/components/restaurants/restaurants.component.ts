import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import { RestaurantService } from '../../services/wordpress/restaurant.service';
import {Dish, Restaurant, DishesTime} from '../../interfaces/restaurant';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit, OnDestroy {

  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  @ViewChild('slides_wrapper') slides_wrapper: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  public restaurants: Restaurant[];
  public restaurant_index: number;
  public showSchedule: boolean;
  public lunch: DishesTime;
  public a_la_carte: DishesTime;
  public selected_day: string;
  private lang: string;
  public pageNotFound: boolean;
  private loading: boolean;
  private swipeCoord: [number, number];
  private swipeTime: number;
  public item_onfocus_index: number;
  public paramsSubscription: Subscription;
  public restaurantSubscription: Subscription;

  constructor(private restaurantService: RestaurantService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.slideIndex = 0;
    this.showSchedule = false;
    this.selected_day = 'monday';
    this.item_onfocus_index = 0;
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      console.log(this.lang);
      this._cookieService.put('language', this.lang);
    });
  }

  swipe(e: TouchEvent, when: string): void {
    console.log(when);
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 // Short enough
          && Math.abs(direction[1]) < Math.abs(direction[0]) // Horizontal enough
          && Math.abs(direction[0]) > 30) {  // Long enough
        if (direction[0] < 0) {
          if (this.item_onfocus_index < this.restaurants.length - 1) {
            this.item_onfocus_index += 1;
            console.log(this.item_onfocus_index);
            this.swipeForward();
            this.restaurant_index = this.item_onfocus_index;
            this.updateDishes();
          }
        }else {
          if (this.item_onfocus_index > 0) {
            this.item_onfocus_index -= 1;
            this.swipeBackward();
            console.log(this.item_onfocus_index);
            this.restaurant_index = this.item_onfocus_index;
            this.updateDishes();
          }
        }
        // Do whatever you want with swipe
      }
    }
  }

  swipeForward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    console.log('swipeForward');
    if (slides_wrapper.style.marginLeft) {
      console.log(parseFloat(slides_wrapper.style.marginLeft));
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) - 85) + '%';
      console.log(margin_left);
    }else {
      margin_left = '-79%';
      console.log(margin_left);
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  swipeBackward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    console.log('swipeForward');
    if (slides_wrapper.style.marginLeft) {
      console.log(parseFloat(slides_wrapper.style.marginLeft));
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) + 85) + '%';
      console.log(margin_left);
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  changeDay(day) {
    this.selected_day = day;
    this.updateDishes();
  }

  showRestaurant(index: number) {
    this.restaurant_index = index;
    this.showSchedule = true;
    this.updateDishes();
  }

  updateDishes() {
    let day_index: number;
    if (this.selected_day === 'monday') {
      day_index = 0;
    }else if (this.selected_day === 'tuesday') {
      day_index = 1;
    }else if (this.selected_day === 'wednesday') {
      day_index = 2;
    }else if (this.selected_day === 'thursday') {
      day_index = 3;
    }else if (this.selected_day === 'friday') {
      day_index = 4;
    }
    if (this.restaurant_index) {
      this.lunch = this.restaurants[this.restaurant_index].menu[day_index].lunch;
      this.a_la_carte = this.restaurants[this.restaurant_index].menu[day_index].a_la_carte;
    }else {
      this.lunch = this.restaurants[this.item_onfocus_index].menu[day_index].lunch;
      this.a_la_carte = this.restaurants[this.item_onfocus_index].menu[day_index].a_la_carte;
      console.log('updateDishes');
    }

  }

  navBefore(): void {
    this.selectSlideElements();
    this.slideIndex--;
    if (this.slideIndex < 0) {
      this.slideIndex = 0;
    }
    this.slides[this.slideIndex + 1].style.left = '-101%';
    this.showActualSlide();
  }

  selectSlideElements(): void {
    if (typeof this.slides === 'undefined') {
      this.slides = this.slides_container.nativeElement.getElementsByClassName('slide-wrapper');
    }
  }

  navNext(): void {
    this.selectSlideElements();
    this.slideIndex++;
    if (this.slideIndex >= this.slides.length) {
      this.slideIndex = this.slides.length - 1;
    }
    this.slides[this.slideIndex - 1].style.left = '101%';
    this.showActualSlide();
  }

  update_progress_bar(): void {
    for (let i = 0; i < this.slides.length; i++) {
      this.bar_items[i].style.backgroundColor = 'lightgray';
    }
    this.bar_items[this.slideIndex].style.backgroundColor = 'gray';
  }

  showActualSlide(): void {
    this.update_progress_bar();
    this.slides[this.slideIndex].style.left = '0';
  }

  ngOnInit() {
    //this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName('bar-item');
    this.restaurantSubscription = this.restaurantService.getRestaurants(this.lang).subscribe((res) => {
          this.loading = false;
          console.log(res);
          this.restaurants = res;
          this.updateDishes();
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
/*    this.slides_items = [
      {
        title: 'THS Café',
        image: 'https://www.kth.se/polopoly_fs/1.713927!/image/IMG_9072%20%28800x533%29.jpg'
      },
      {
        title: 'THS Entré',
        image: 'https://campi.kth.se/polopoly_fs/1.365256!/image/central_entreNV.jpg'
      },
      {
        title: 'Nymble Restaurant',
        image: 'https://gastrogate.com/thumbs/620x250/files/28928/nymble_bar_kok_matsal_restaurang_kth_stockholm_003.jpg'
      },
    ];*/
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.restaurantSubscription.unsubscribe();
  }
}
