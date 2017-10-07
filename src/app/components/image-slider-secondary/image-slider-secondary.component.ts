import {Component, OnInit, Renderer2, HostListener, ViewChild, ElementRef, Input} from '@angular/core';
import {Association} from '../../interfaces/chapters_associations';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';

@Component({
  selector: 'app-image-slider-secondary',
  templateUrl: './image-slider-secondary.component.html',
  styleUrls: ['./image-slider-secondary.component.scss']
})
export class ImageSliderSecondaryComponent implements OnInit {
  @Input() data: any;
  @ViewChild('slider') slider: ElementRef;
  public touchStartListener: any;
  public enableScroll: boolean;

  constructor(private renderer: Renderer2,
              private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.enableScroll = false;
  }

  showAssociationInPopup(item: Association): void {
    this.popupWindowCommunicationService.showAssociationInPopup({association: item, relatedAssociations: this.data.items});
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
                console.log(self.slider.nativeElement.getElementsByClassName('items-wrapper')[0].style.width);
              }
            }, 100);
          }
        }, 100);
        self.touchStartListener = self.renderer.listen(self.slider.nativeElement, 'touchstart', (event) => {
          //event.preventDefault();
          self.showScroll();
        });

        self.touchStartListener = self.renderer.listen(self.slider.nativeElement, 'touchend', (event) => {
          //event.preventDefault();
          self.hideScroll();
        });
      }
    }, 100);
  }

}
