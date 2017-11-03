import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-text-slider',
  templateUrl: './text-slider.component.html',
  styleUrls: ['./text-slider.component.scss']
})
export class TextSliderComponent implements OnInit, OnDestroy {

  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  public slides_items: any;
  public sliderSubscription: Subscription;

  constructor(private textSliderCommunicationService: TextSliderCommunicationService) {
    this.slideIndex = 0;
  }

  selectSlide(index): void {
    console.log(index);
    this.selectSlideElements();
    if (this.slideIndex !== index) {
      if (this.slideIndex < index) {
        this.slides[this.slideIndex].style.left = '-101%';
        this.slideIndex = index;
        this.showActualSlide();
      }else {
        this.slides[this.slideIndex].style.left = '101%';
        this.slideIndex = index;
        this.showActualSlide();
      }
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
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName('bar-item');
    this.textSliderCommunicationService.notifyObservable$.subscribe((arg) => {
      this.slides_items = arg;
    });
  }

  ngOnDestroy() {
    if (this.sliderSubscription) {
      this.sliderSubscription.unsubscribe();
    }
  }

}
