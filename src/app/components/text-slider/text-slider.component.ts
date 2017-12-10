import {Component, OnInit, ViewChild, ElementRef, OnDestroy, Input} from '@angular/core';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {FAQ} from '../../interfaces/faq';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';

@Component({
  selector: 'app-text-slider',
  templateUrl: './text-slider.component.html',
  styleUrls: ['./text-slider.component.scss']
})
export class TextSliderComponent implements OnInit, OnDestroy {
  @Input() lang: any;
  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  public slides_items: any;
  public sliderSubscription: Subscription;

  constructor(private textSliderCommunicationService: TextSliderCommunicationService,
              private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.slideIndex = 0;
  }

  showInPopup(faq: FAQ): void {
    this.popupWindowCommunicationService.showFaqInPopup(faq);
  }

  selectSlide(index): void {
    this.selectSlideElements();
    if (this.slideIndex !== index) {
      this.slideIndex = index;
      this.slides.style.marginLeft = this.slideIndex * -100 + '%';
    }
  }

  navBefore(): void {
    this.selectSlideElements();
    this.slideIndex--;
    if (this.slideIndex < 0) {
      this.slideIndex = 0;
    }
    this.slides.style.marginLeft = (this.slideIndex * -100) + '%';
  }

  selectSlideElements(): void {
    if (typeof this.slides === 'undefined') {
      this.slides = this.slides_container.nativeElement.getElementsByClassName('slides')[0];
    }
  }

  navNext(): void {
    this.selectSlideElements();
    this.slideIndex++;
    if (this.slideIndex >= this.slides.length) {
      this.slideIndex = this.slides.length - 1;
    }
    this.slides.style.marginLeft =  (this.slideIndex * -100) + '%';
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
