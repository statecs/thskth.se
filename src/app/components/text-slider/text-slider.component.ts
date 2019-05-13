import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input
} from "@angular/core";
import { TextSliderCommunicationService } from "../../services/component-communicators/text-slider-communication.service";
import { Subscription } from "rxjs/Subscription";
import { Location } from "@angular/common";
import { FAQ } from "../../interfaces-and-classes/faq";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";

@Component({
  selector: "app-text-slider",
  templateUrl: "./text-slider.component.html",
  styleUrls: ["./text-slider.component.scss"]
})
export class TextSliderComponent implements OnInit, OnDestroy {
  @Input() lang: any;
  @ViewChild("slides_container") slides_container: ElementRef;
  @ViewChild("slider_progress_bar") slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  private swipeCoord: [number, number];
  private swipeTime: number;
  @Input() slides_items: any;
  public sliderSubscription: Subscription;

  constructor(
    private textSliderCommunicationService: TextSliderCommunicationService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private location: Location
  ) {
    this.slideIndex = 0;
  }

  showInPopup(faq: FAQ): void {
    this.popupWindowCommunicationService.showFaqInPopup(faq);
    if (this.lang === "sv") {
      this.location.go("sv/help/faqs/" + faq.slug);
    } else {
      this.location.go("en/help/faqs/" + faq.slug);
    }
  }

  selectSlide(index): void {
    this.selectSlideElements();
    if (this.slideIndex !== index) {
      this.slideIndex = index;
      this.slides.style.marginLeft = this.slideIndex * -100 + "%";
    }
  }

  swipe(e: TouchEvent, when: string, link: string): void {
    const coord: [number, number] = [
      e.changedTouches[0].pageX,
      e.changedTouches[0].pageY
    ];
    const time = new Date().getTime();

    if (when === "start") {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === "end") {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1]
      ];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 && // Short enough
        Math.abs(direction[1]) < Math.abs(direction[0]) && // Horizontal enough
        Math.abs(direction[0]) > 30
      ) {
        // Long enough
        if (direction[0] < 0) {
          this.selectSlideElements();
          this.slideIndex++;
          if (this.slideIndex >= this.slides.length) {
            this.slideIndex = this.slides.length - 1;
          }
          this.slides.style.marginLeft = this.slideIndex * -100 + "%";
        } else {
          this.selectSlideElements();
          this.slideIndex--;
          if (this.slideIndex < 0) {
            this.slideIndex = 0;
          }
          this.slides.style.marginLeft = this.slideIndex * -100 + "%";
        }
      }
    }
  }

  navBefore(): void {
    this.selectSlideElements();
    this.slideIndex--;
    if (this.slideIndex < 0) {
      this.slideIndex = 0;
    }
    this.slides.style.marginLeft = this.slideIndex * -100 + "%";
  }

  selectSlideElements(): void {
    if (typeof this.slides === "undefined") {
      this.slides = this.slides_container.nativeElement.getElementsByClassName(
        "slides"
      )[0];
    }
  }

  navNext(): void {
    this.selectSlideElements();
    this.slideIndex++;
    if (this.slideIndex >= this.slides.length) {
      this.slideIndex = this.slides.length - 1;
    }
    this.slides.style.marginLeft = this.slideIndex * -100 + "%";
  }

  ngOnInit() {
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName(
      "bar-item"
    );
    /*this.textSliderCommunicationService.notifyObservable$.subscribe((arg) => {
      this.slides_items = arg;
    });*/
  }

  ngOnDestroy() {
    if (this.sliderSubscription) {
      this.sliderSubscription.unsubscribe();
    }
  }
}
