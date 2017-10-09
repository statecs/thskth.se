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
  private swipeCoord: [number, number];
  private swipeTime: number;

  constructor(private imageSliderCommunicationService: ImageSliderCommunicationService) {
    this.item_onfocus_index = 1;
    this.slide_items = [];
  }

    getLastItemIndex(): number {
      let index = 0;
      const timer = setInterval(function () {
          if (this.slide_items) {
              clearInterval(timer);
              index = this.slide_items.length + 1;
          }
      });
      return index;
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
          if (this.item_onfocus_index <= this.slide_items.length - 1) {
            this.item_onfocus_index += 1;
            console.log(this.item_onfocus_index);
            this.swipeBackward();
          }
        }else {
          if (this.item_onfocus_index >= 0) {
            this.item_onfocus_index -= 1;
            this.swipeForward();
          }
        }
        // Do whatever you want with swipe
      }
    }
  }

    swipeForward(): void {
        const slides_wrappers = this.slides_container.nativeElement.getElementsByClassName('slides-wrapper');
        let margin_left = '';
        console.log('swipeForward');
        for (let i = 0; i < slides_wrappers.length; i++) {
            if (slides_wrappers[i].style.marginLeft) {
                margin_left = (parseFloat(slides_wrappers[i].style.marginLeft) + 53) + '%';
                console.log(margin_left);
            }else {
                margin_left = '-43.5%';
                console.log(margin_left);
            }
            slides_wrappers[i].style.marginLeft = margin_left;
        }
    }

    swipeBackward(): void {
        const slides_wrappers = this.slides_container.nativeElement.getElementsByClassName('slides-wrapper');
        let margin_left = '';
        console.log('swipeBackward');
        for (let i = 0; i < slides_wrappers.length; i++) {
            if (slides_wrappers[i].style.marginLeft) {
                margin_left = (parseFloat(slides_wrappers[i].style.marginLeft) - 53) + '%';
                console.log(margin_left);
            }else {
                margin_left = '-149.5%';
                console.log(margin_left);
            }
            slides_wrappers[i].style.marginLeft = margin_left;
        }
    }

  switchSlide(index): void {
    if (index > this.item_onfocus_index) {
      this.previousSlide();
    }else if (index < this.item_onfocus_index) {
      this.nextSlide();
    }
    this.item_onfocus_index = index;
  }

  nextSlide(): void {
    const slides_wrappers = this.slides_container.nativeElement.getElementsByClassName('slides-wrapper');
    let margin_left = '';
    console.log('move right');
    for (let i = 0; i < slides_wrappers.length; i++) {
      if (slides_wrappers[i].style.marginLeft) {
        margin_left = (parseFloat(slides_wrappers[i].style.marginLeft) + 29.6) + '%';
        console.log(margin_left);
      }else {
        margin_left = '-2.05%';
        console.log(margin_left);
      }
      slides_wrappers[i].style.marginLeft = margin_left;
    }
  }

  previousSlide(): void {
    const slides_wrappers = this.slides_container.nativeElement.getElementsByClassName('slides-wrapper');
    let margin_left = '';
    console.log('move left');
    for (let i = 0; i < slides_wrappers.length; i++) {
      if (slides_wrappers[i].style.marginLeft) {
        margin_left = (parseFloat(slides_wrappers[i].style.marginLeft) - 29.6) + '%';
        console.log(margin_left);
      }else {
        margin_left = '-61.25%';
        console.log(margin_left);
      }
      slides_wrappers[i].style.marginLeft = margin_left;
    }
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
