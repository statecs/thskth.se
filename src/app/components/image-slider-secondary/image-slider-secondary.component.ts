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
    if (this.slider) {
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

}
