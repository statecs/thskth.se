import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { HeaderSlide } from "../../interfaces-and-classes/chapters_associations";

@Component({
  selector: "app-header-slider",
  templateUrl: "./header-slider.component.html",
  styleUrls: ["./header-slider.component.scss"]
})
export class HeaderSliderComponent implements OnInit {
  @Input() slides_items: HeaderSlide[];

  @ViewChild("slides_container") slides_container: ElementRef;
  @ViewChild("slider_progress_bar") slider_progress_bar: ElementRef;
  public slides: any;
  public slideIndex: number;
  public bar_items: any;
  private swipeCoord: [number, number];
  private swipeTime: number;

  constructor() {
    this.slideIndex = 0;
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
          // this.hideAllSlides();
          this.selectSlideElements();
          this.slideIndex++;
          if (this.slideIndex >= this.slides.length) {
            this.slideIndex = this.slides.length - 1;
          }
          this.slides[this.slideIndex - 1].style.left = "-101%";
          this.showActualSlide();
        } else {
          this.selectSlideElements();
          this.slideIndex--;
          if (this.slideIndex < 0) {
            this.slideIndex = 0;
          }
          this.slides[this.slideIndex + 1].style.left = "101%";
          this.showActualSlide();
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
    this.slides[this.slideIndex + 1].style.left = "101%";
    this.showActualSlide();
  }

  selectSlideElements(): void {
    if (typeof this.slides === "undefined") {
      this.slides = this.slides_container.nativeElement.getElementsByClassName(
        "slide-wrapper"
      );
    }
  }

  navNext(): void {
    this.selectSlideElements();
    this.slideIndex++;
    if (this.slideIndex >= this.slides.length) {
      this.slideIndex = this.slides.length - 1;
    }
    this.slides[this.slideIndex - 1].style.left = "-101%";
    this.showActualSlide();
  }

  showActualSlide(): void {
    this.slides[this.slideIndex].style.left = "0";
  }
  clickActualSlide(index): void {
    console.log(index);
    this.selectSlideElements();
    if (index < this.slides.length) {
      this.slideIndex++;
      if (this.slideIndex >= this.slides.length) {
        this.slideIndex = this.slides.length - 1;
      }
      this.slides[this.slideIndex - 1].style.left = "-101%";
      this.showActualSlide();
    } else {
      this.slideIndex--;
      if (this.slideIndex < 0) {
        this.slideIndex = 0;
      }
      this.slides[this.slideIndex + 1].style.left = "101%";
      this.showActualSlide();
    }
  }

  ngOnInit() {
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName(
      "bar-item"
    );
  }
}
