import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
  Input
} from "@angular/core";
import { ImageSliderCommunicationService } from "../../services/component-communicators/image-slider-communication.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { Location } from "@angular/common";
import * as format from "date-fns/format";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-image-slider",
  templateUrl: "./image-slider.component.html",
  styleUrls: ["./image-slider.component.scss"]
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @ViewChild("slides_container") slides_container: ElementRef;
  @ViewChild("slider_progress_bar") slider_progress_bar: ElementRef;
  @Input() lang: any;
  @Input() slide_items: any;
  public slides_wrapper: any;
  public item_onfocus_index: number;
  public bar_items: any;
  private swipeCoord: [number, number];
  private swipeTime: number;
  public see_more: string;
  public news_text: string;
  public paramsSubscription: Subscription;
  public imageSliderSubscription: Subscription;
  public deviceSize: number;
  public dragging: boolean;
  public draggedPosition: number;
  public drag_start_pos: number;
  public margin_left: number;

  constructor(
    private imageSliderCommunicationService: ImageSliderCommunicationService,
    private activatedRoute: ActivatedRoute,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private location: Location,
    private _cookieService: CookieService
  ) {
    this.item_onfocus_index = 0;
    this.dragging = false;
    // this.lang = this.activatedRoute.snapshot.data["lang"];
    this.deviceSize = window.screen.width;
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
    if (this.lang === "sv") {
      this.news_text = "THS Nyheter";
      this.see_more = "Se Mer";
    } else {
      this.news_text = "THS News";
      this.see_more = "See More";
    }
  }

  @HostListener("document:touchmove", ["$event"])
  touchMoving(event) {
    event = event.touches[0];
    if (this.dragging) {
      if (!this.draggedPosition) {
        this.draggedPosition = event.clientX;
        this.drag_start_pos = event.clientX;
      }
      const distance =
        ((event.clientX - this.draggedPosition) /
          (this.slides_wrapper[1].clientWidth / 4)) *
        100;
      if (this.slides_wrapper[1].style.marginLeft) {
        this.margin_left =
          parseFloat(this.slides_wrapper[1].style.marginLeft) + distance;
      } else {
        this.margin_left = -165 + distance;
      }
      this.slides_wrapper[1].style.marginLeft = this.margin_left + "%";
      this.draggedPosition = event.clientX;
    }
  }

  formatDate(created_time): string {
    return format(created_time, "DD MMM YYYY");
  }

  dragstart(): void {
    this.dragging = true;
  }

  dragend(): void {
    let index;
    if (this.margin_left > 7) {
      index = 0;
    } else {
      if (this.draggedPosition < this.drag_start_pos) {
        index = Math.round(Math.abs(this.margin_left - 15 /*7*/) / 86);
      } else {
        index = Math.round(Math.abs(this.margin_left + 15 /*7*/) / 86);
      }
    }
    if (index < 0) {
      index = 0;
    }
    if (index > 6) {
      index = 6;
    }
    //this.slides_wrapper[1].style.marginLeft = this.margin_left + '%';
    this.selectSlideMobile(index);
    this.dragging = false;
    this.draggedPosition = null;
  }

  selectSlideMobile(index): void {
    const margin_left = 7 - 86 * index + "%";
    /*for (let i = 0; i < this.slides_wrapper.length; i++) {
            this.slides_wrapper[i].style.marginLeft = margin_left;
        }*/
    this.slides_wrapper[1].style.marginLeft = margin_left;
    this.item_onfocus_index = index - 1;
  }

  selectSlide(index): void {
    const margin_left = -2.05 - 29.6 * index + "%";
    for (let i = 0; i < this.slides_wrapper.length; i++) {
      this.slides_wrapper[i].style.marginLeft = margin_left;
    }
    this.item_onfocus_index = index - 1;
  }

  getBgUrl(image: any): string {
    let url = "";
    if (image !== "") {
      if (this.deviceSize < 768) {
        url = image.large;
      } else if (this.deviceSize >= 768 && this.deviceSize < 992) {
        url = image.large;
      } else if (this.deviceSize >= 992 && this.deviceSize < 1200) {
        url = image.large;
      } else if (this.deviceSize >= 1200) {
        url = image.large;
      }
    }
    return url;
  }

  goToPage(item, slug) {
    if (this.lang === "sv") {
      slug = "sv/news/" + slug;
    } else {
      slug = "en/news/" + slug;
    }
    const arg = {
      article: item,
      page_location: "home"
    };
    this.popupWindowCommunicationService.showNewsInPopup(arg);
    this.location.go(slug);
  }

  getLastItemIndex(): number {
    let index = 0;
    const timer = setInterval(function() {
      if (this.slide_items) {
        clearInterval(timer);
        index = this.slide_items.length + 1;
      }
    });
    return index;
  }

  swipe(e: TouchEvent, when: string): void {
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
          if (this.item_onfocus_index <= this.slide_items.length - 1) {
            this.item_onfocus_index += 1;
            this.swipeBackward();
          }
        } else {
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
    let margin_left = "";
    for (let i = 0; i < this.slides_wrapper.length; i++) {
      if (this.slides_wrapper[i].style.marginLeft) {
        /*margin_left = (parseFloat(this.slides_wrapper[i].style.marginLeft) + 53) + '%';*/
        margin_left =
          parseFloat(this.slides_wrapper[i].style.marginLeft) + 86 + "%";
      } else {
        margin_left = "-79%";
      }
      this.slides_wrapper[i].style.marginLeft = margin_left;
    }
  }

  swipeBackward(): void {
    let margin_left = "";
    for (let i = 0; i < this.slides_wrapper.length; i++) {
      if (this.slides_wrapper[i].style.marginLeft) {
        margin_left =
          parseFloat(this.slides_wrapper[i].style.marginLeft) - 86 + "%";
      } else {
        margin_left = "-251%";
      }
      this.slides_wrapper[i].style.marginLeft = margin_left;
    }
  }

  switchSlide(item, index): void {
    if (index === this.item_onfocus_index) {
      this.goToPage(item, item.slug);
    } else if (index > this.item_onfocus_index) {
      this.previousSlide();
    } else if (index < this.item_onfocus_index) {
      this.nextSlide();
    }
    this.item_onfocus_index = index;
  }

  nextSlide(): void {
    let margin_left = "";
    for (let i = 0; i < this.slides_wrapper.length; i++) {
      if (this.slides_wrapper[i].style.marginLeft) {
        margin_left =
          parseFloat(this.slides_wrapper[i].style.marginLeft) + 29.6 + "%";
      } else {
        margin_left = "-2.05%";
      }
      this.slides_wrapper[i].style.marginLeft = margin_left;
    }
  }

  previousSlide(): void {
    let margin_left = "";
    for (let i = 0; i < this.slides_wrapper.length; i++) {
      if (this.slides_wrapper[i].style.marginLeft) {
        margin_left =
          parseFloat(this.slides_wrapper[i].style.marginLeft) - 29.6 + "%";
      } else {
        margin_left = "-61.25%";
      }
      this.slides_wrapper[i].style.marginLeft = margin_left;
    }
  }

  ngOnInit() {
    this.bar_items = this.slider_progress_bar.nativeElement.getElementsByClassName(
      "bar-item"
    );
    this.slides_wrapper = this.slides_container.nativeElement.getElementsByClassName(
      "slides-wrapper"
    );
    /*this.imageSliderSubscription = this.imageSliderCommunicationService.notifyObservable$.subscribe((data) => {
      this.slide_items = data;
    });*/
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.imageSliderSubscription) {
      this.imageSliderSubscription.unsubscribe();
    }
  }
}
