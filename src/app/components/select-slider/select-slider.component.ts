import {Component, AfterViewInit, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import {SelectSliderCommunicationService} from '../../services/component-communicators/select-slider-communication.service';
import {AppCommunicationService} from '../../services/component-communicators/app-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-select-slider',
  templateUrl: './select-slider.component.html',
  styleUrls: ['./select-slider.component.scss']
})
export class SelectSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('slider') slider: ElementRef;
    public slide_items: ElementRef[];
    public item_onfocus: any;
    public item_onfocus_index: number;
    private upper_threshold: number;
    private lower_threshold: number;
    public showSelectSlider: boolean;
    public data: any;
    public sliderSubscription: Subscription;

  constructor(private renderer: Renderer2,
              private selectSliderCommunicationService: SelectSliderCommunicationService,
              private appCommunicationService: AppCommunicationService) {
      this.item_onfocus_index = 0;
      this.showSelectSlider = false;
  }

    hide_select_slider() {
      this.showSelectSlider = false;
      const data = {
          type: this.data.type,
          item: this.data.items[this.item_onfocus_index]
      };
      this.selectSliderCommunicationService.transmitSelectedItem(data);
      this.appCommunicationService.collapseScrollOnPage('show');
    }

    show_select_slider(): void {
      this.item_onfocus_index = 0;
      this.showSelectSlider = true;
      this.appCommunicationService.collapseScrollOnPage('collapse');
    }

    initSelectSlider(): void {
      const self = this;
      const timer = setInterval(function(){
          if (self.slider) {
              self.slider.nativeElement.scrollTop = 0;
          }
          if (self.slider.nativeElement.getElementsByClassName('selected')[0]) {
              clearInterval(timer);
              self.upper_threshold = self.slider.nativeElement.getElementsByClassName('selected')[0].offsetHeight / 2;
              self.lower_threshold = 0;
              self.renderer.listen(self.slider.nativeElement, 'scroll', (event) => {
                  self.item_onfocus = self.slider.nativeElement.getElementsByClassName('selected')[0];
                  const scrollPos = self.slider.nativeElement.scrollTop;
                  if (scrollPos >= self.upper_threshold && self.item_onfocus_index < self.data.items.length) {
                      self.item_onfocus_index += 1;
                      self.upper_threshold += self.item_onfocus.offsetHeight;
                      self.lower_threshold += self.item_onfocus.offsetHeight / 2;
                  }else if (scrollPos < self.lower_threshold && self.item_onfocus_index > 0) {
                      self.item_onfocus_index -= 1;
                      self.upper_threshold -= self.item_onfocus.offsetHeight;
                      self.lower_threshold -= self.item_onfocus.offsetHeight / 2;
                  }
              });
          }
      }, 100);
    }

  ngAfterViewInit() {
      this.sliderSubscription = this.selectSliderCommunicationService.notifyObservable$.subscribe((data) => {
          this.data = data;
          this.show_select_slider();
          this.initSelectSlider();
      });
  }

    ngOnDestroy() {
        if (this.sliderSubscription) {
            this.sliderSubscription.unsubscribe();
        }
    }

}
