import {Component, OnInit, Renderer2, HostListener, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-image-slider-secondary',
  templateUrl: './image-slider-secondary.component.html',
  styleUrls: ['./image-slider-secondary.component.scss']
})
export class ImageSliderSecondaryComponent implements OnInit {

  @ViewChild('slider') slider: ElementRef;
  public touchStartListener: any;
  public enableScroll: boolean;

  constructor(private renderer: Renderer2) {
    this.enableScroll = false;
  }

  showScroll() {
    console.log('showScroll');
    this.enableScroll = true;
    //this.slider.nativeElement.style.overflowX = 'scroll';
  }

  hideScroll() {
    console.log('hideScroll');
    this.enableScroll = false;
    //this.slider.nativeElement.style.overflowX = 'hidden';
  }

  ngOnInit() {
    this.touchStartListener = this.renderer.listen(this.slider.nativeElement, 'touchstart', (event) => {
      //event.preventDefault();
      this.showScroll();
    });

    this.touchStartListener = this.renderer.listen(this.slider.nativeElement, 'touchend', (event) => {
      //event.preventDefault();
      this.hideScroll();
    });
  }

}
