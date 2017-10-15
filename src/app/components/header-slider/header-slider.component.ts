import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HeaderSlide} from '../../interfaces/chapters_associations';

@Component({
  selector: 'app-header-slider',
  templateUrl: './header-slider.component.html',
  styleUrls: ['./header-slider.component.scss']
})
export class HeaderSliderComponent implements OnInit {
  @Input() slides_items: HeaderSlide[];

  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('slider_progress_bar') slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;

  constructor() {
    this.slideIndex = 0;
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
/*    this.update_progress_bar();*/
    this.slides[this.slideIndex].style.left = '0';
  }

  ngOnInit() {
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName('bar-item');
  }
}
