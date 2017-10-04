import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2} from '@angular/core';

@Component({
  selector: 'app-select-slider',
  templateUrl: './select-slider.component.html',
  styleUrls: ['./select-slider.component.scss']
})
export class SelectSliderComponent implements AfterViewInit {
    @ViewChild('slider') slider: ElementRef;
    public slide_items: ElementRef[];
    public item_onfocus: any;
    public item_onfocus_index: number;
    private upper_threshold: number;
    private lower_threshold: number;

  constructor(private renderer: Renderer2) {
      this.item_onfocus_index = 0;
  }

  ngAfterViewInit() {
      this.upper_threshold = this.slider.nativeElement.getElementsByClassName('selected')[0].offsetHeight / 2;
      this.lower_threshold = 0;
      console.log(this.upper_threshold);
      this.renderer.listen(this.slider.nativeElement, 'scroll', (event) => {
          this.item_onfocus = this.slider.nativeElement.getElementsByClassName('selected')[0];
          console.log(this.item_onfocus.offsetTop);
          console.log(this.slider.nativeElement.scrollTop);
          const scrollPos = this.slider.nativeElement.scrollTop;
          console.log('scrollPos: ' + scrollPos);
          console.log('upper_threshold: ' + this.upper_threshold);
          console.log('lower_threshold: ' + this.lower_threshold);
          if (scrollPos >= this.upper_threshold) {
              console.log('change');
              this.item_onfocus_index += 1;
              this.upper_threshold += this.item_onfocus.offsetHeight;
              this.lower_threshold += this.item_onfocus.offsetHeight / 2;
          }else if (scrollPos < this.lower_threshold) {
              console.log('change back');
              this.item_onfocus_index -= 1;
              this.upper_threshold -= this.item_onfocus.offsetHeight;
              this.lower_threshold -= this.item_onfocus.offsetHeight / 2;
          }
      });
      /*for (let i = 0; i < this.slide_items.length; i++) {
          this.renderer.listen(this.slide_items[i], 'scroll', (event) => {
              console.log('scroll');
          });
      }*/
  }

}
