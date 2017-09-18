import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import { RestaurantService } from '../../services/wordpress/restaurant.service';
import {Dish, Restaurant, DishesTime} from '../../interfaces/restaurant';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  public restaurants: Restaurant[];
  public restaurant_index: number;
  public showSchedule: boolean;
  public lunch: DishesTime;
  public a_la_carte: DishesTime;
  public selected_day: string;

  constructor(private restaurantService: RestaurantService) {
    this.slideIndex = 0;
    this.showSchedule = false;
    this.selected_day = 'monday';
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
    this.lunch = this.restaurants[this.restaurant_index].menu[day_index].lunch;
    this.a_la_carte = this.restaurants[this.restaurant_index].menu[day_index].a_la_carte;
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
    this.restaurantService.getRestaurants().subscribe((res) => {
      console.log(res);
      this.restaurants = res;
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
}
