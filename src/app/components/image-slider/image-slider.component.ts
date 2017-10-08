import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ImageSliderCommunicationService} from '../../services/component-communicators/image-slider-communication.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  public slides: any;
  public item_onfocus_index: number;
  public bar_items: any;
  public slide_items: any[];

  constructor(private imageSliderCommunicationService: ImageSliderCommunicationService) {
    this.item_onfocus_index = 1;
    this.slide_items = [];
  }

  switchSlide(index): void {
    const slides_wrapper = this.slides_container.nativeElement.getElementsByClassName('slides-wrapper')[0];
    let margin_left = '';
    if (index > this.item_onfocus_index) {
      console.log('move left');
      if (slides_wrapper.style.marginLeft) {
        margin_left = (parseFloat(slides_wrapper.style.marginLeft) - 29.6) + '%';
        console.log(margin_left);
      }else {
        margin_left = '-61.25%';
        console.log(margin_left);
      }
      slides_wrapper.style.marginLeft = margin_left;
    }else if (index < this.item_onfocus_index) {
      console.log('move right');
      if (slides_wrapper.style.marginLeft) {
        margin_left = (parseFloat(slides_wrapper.style.marginLeft) + 29.6) + '%';
        console.log(margin_left);
      }else {
        margin_left = '-2.05%';
        console.log(margin_left);
      }
      slides_wrapper.style.marginLeft = margin_left;
    }
    this.item_onfocus_index = index;
  }
/*
  update_progress_bar(): void {
    for (let i = 0; i < this.slides.length; i++) {
      this.bar_items[i].style.backgroundColor = 'lightgray';
    }
    this.bar_items[this.item_onfocus_index - 1].style.backgroundColor = 'gray';
  }*/

  ngOnInit() {
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName('bar-item');
    this.slides = this.slides_container.nativeElement.getElementsByClassName('slide-wrapper');

    // this.update_progress_bar();
    this.imageSliderCommunicationService.notifyObservable$.subscribe((data) => {
      console.log(data);
      this.slide_items = data;
    });
  }

}
