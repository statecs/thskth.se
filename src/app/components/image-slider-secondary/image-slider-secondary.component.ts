import {Component, OnInit, Renderer2, ViewChild, ElementRef, Input} from '@angular/core';
import {Association} from '../../interfaces/chapters_associations';
import {Router} from '@angular/router';

@Component({
  selector: 'app-image-slider-secondary',
  templateUrl: './image-slider-secondary.component.html',
  styleUrls: ['./image-slider-secondary.component.scss']
})
export class ImageSliderSecondaryComponent implements OnInit {
  @Input() data: any;
  @Input() lang: any;
  @ViewChild('slider') slider: ElementRef;
  public touchStartListener: any;
  public enableScroll: boolean;

  constructor(private renderer: Renderer2,
              private router: Router) {
    this.enableScroll = false;
  }

  showAssociationInPopup(item: Association): void {
    this.router.navigate([this.lang + '/associations-and-chapters/' + item.slug]);
  }

  showScroll() {
    this.enableScroll = true;
  }

  hideScroll() {
    this.enableScroll = false;
  }

  ngOnInit() {
    const self = this;
    const timmer = setInterval(function () {
      if (self.slider) {
        clearInterval(timmer);
        const timmer2 = setInterval(function () {
          if (self.slider.nativeElement.getElementsByClassName('item')[0]) {
            clearInterval(timmer2);
            const items = self.slider.nativeElement.getElementsByClassName('item');
            const wrapper_width: number = items.length * items[0].clientWidth + items.length * 10;
            const timmer3 = setInterval(function () {
              if (self.slider.nativeElement.getElementsByClassName('items-wrapper')[0]) {
                clearInterval(timmer3);
                self.slider.nativeElement.getElementsByClassName('items-wrapper')[0].style.width = wrapper_width + 'px';
              }
            }, 100);
          }
        }, 100);
        self.touchStartListener = self.renderer.listen(self.slider.nativeElement, 'touchstart', (event) => {
          self.showScroll();
        });

        self.touchStartListener = self.renderer.listen(self.slider.nativeElement, 'touchend', (event) => {
          self.hideScroll();
        });
      }
    }, 100);
  }

}
