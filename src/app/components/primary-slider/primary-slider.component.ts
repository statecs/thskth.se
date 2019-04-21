import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { PrimarySlidesService } from "../../services/wordpress/primary-slides.service";
import { Slide } from "../../interfaces-and-classes/slide";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-primary-slider",
  templateUrl: "./primary-slider.component.html",
  styleUrls: ["./primary-slider.component.scss"]
})
export class PrimarySliderComponent implements OnInit, OnDestroy {
  @ViewChild("primary_slider") primary_slider: ElementRef;
  @ViewChild("slides_container") slides_container: ElementRef;
  @ViewChild("video_player") video_player: ElementRef;
  @ViewChild("slider_bar_container_fluid")
  slider_bar_container_fluid: ElementRef;
  @ViewChild("playButton") playButton: ElementRef;

  public slides_img_base: string;
  public slider_progress_bars: any;
  public video: any;
  public controlsOpacity: number;
  public mousemove_timer: any;
  public mainSlide_timer: any;
  public bg_image: any;
  public fetching: boolean;
  public bg_image_last: any;
  private swipeCoord: [number, number];
  private swipeTime: number;
  public slideIndex: number;
  public slides: Slide[];
  public slideshow_play_btn: string;
  public slideElements: any[];
  private lang: string;
  public read_more_text: string;
  public paramsSubscription: Subscription;
  public slideSubscription: Subscription;
  public headerSubscription: Subscription;
  public deviceSize: number;
  private headerCommunicationSub: Subscription;

  constructor(
    private headerCommunicationService: HeaderCommunicationService,
    private primarySlidesService: PrimarySlidesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService
  ) {
    this.slides_img_base = "../../../assets/images/main_slider/";
    this.slideIndex = 0;
    this.slideshow_play_btn = "pause";
    this.deviceSize = window.screen.width;
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
          this.hideAllSlides();
          clearInterval(this.mainSlide_timer);
          this.slideshow_play_btn = "play_arrow";
          this.slideIndex++;
          if (this.slideIndex >= this.slides.length) {
            this.slideIndex = 0;
          }
          this.showSlide();
        } else {
          this.hideAllSlides();
          clearInterval(this.mainSlide_timer);
          this.slideshow_play_btn = "play_arrow";
          this.slideIndex--;
          if (this.slideIndex < 0) {
            this.slideIndex = this.slides.length - 1;
          }

          this.showSlide();
        }
      }
    }
  }

  goToPage(slug): void {
    if (
      slug.indexOf("http://") === 0 ||
      slug.indexOf("https://") === 0 ||
      slug.indexOf("www.") === 0
    ) {
      window.open(slug, "_black");
    } else {
      this.router.navigate([slug]);
    }
  }

  startMainSlider(): void {
    const self = this;
    this.mainSlide_timer = setInterval(function() {
      self.hideAllSlides();
      self.slideIndex++;
      if (self.slideIndex >= self.slides.length) {
        self.slideIndex = 0;
      }
      self.showSlide();
    }, 10000);
  }

  toggleMainSlider(): void {
    if (this.slideshow_play_btn === "pause") {
      this.slideshow_play_btn = "play_arrow";
      clearInterval(this.mainSlide_timer);
    } else {
      this.slideshow_play_btn = "pause";
      this.startMainSlider();
    }
  }

  hideAllSlides(): void {
    this.slider_progress_bars = this.slider_bar_container_fluid.nativeElement.getElementsByClassName(
      "slider-progress-bar"
    );
    this.slideElements = this.slides_container.nativeElement.getElementsByClassName(
      "slide"
    );
    if (
      typeof this.slider_progress_bars !== "undefined" &&
      typeof this.slideElements !== "undefined"
    ) {
      if (typeof this.slideElements[this.slideIndex] !== "undefined") {
        this.slideElements[this.slideIndex].style.right = 0;
        this.slideElements[this.slideIndex].style.opacity = 0;
      }
      this.slider_progress_bars[this.slideIndex].style.backgroundColor = "gray";
    }
  }

  getBgUrl(slide: Slide): string {
    let url = "";
    if (slide.bg_image !== "") {
      const image = slide.bg_image;
      if (this.deviceSize < 768) {
        url = image.image640;
      } else if (this.deviceSize >= 768 && this.deviceSize < 992) {
        url = image.image960;
      } else if (this.deviceSize >= 992 && this.deviceSize < 1200) {
        url = image.image1280;
      } else if (this.deviceSize >= 1200) {
        url = image.image1920;
      }
    }
    return url;
  }

  showSlide(): void {
    this.slider_progress_bars = this.slider_bar_container_fluid.nativeElement.getElementsByClassName(
      "slider-progress-bar"
    );
    if (typeof this.slides_container !== "undefined") {
      this.slideElements = this.slides_container.nativeElement.getElementsByClassName(
        "slide"
      );
    }

    if (
      typeof this.slider_progress_bars !== "undefined" &&
      typeof this.slideElements !== "undefined"
    ) {
      if (typeof this.slideElements[this.slideIndex] !== "undefined") {
        this.slideElements[this.slideIndex].style.visibility = "visible";
        this.slideElements[this.slideIndex].style.opacity = 1;
      }

      const image = this.slides[this.slideIndex].bg_image;
      if (this.deviceSize < 768) {
        this.bg_image = image.image640;
      } else if (this.deviceSize >= 768 && this.deviceSize < 992) {
        this.bg_image = image.image960;
      } else if (this.deviceSize >= 992 && this.deviceSize < 1200) {
        this.bg_image = image.image1280;
      } else if (this.deviceSize >= 1200) {
        this.bg_image = image.image1920;
      }

      this.primary_slider.nativeElement.style.background =
        'url("' + this.bg_image + '") no-repeat center / cover';
      this.primary_slider.nativeElement.style.transition =
        "opacity 1s ease-in-out";
      this.primary_slider.nativeElement.style.opacity = "1";

      if (typeof this.slider_progress_bars[this.slideIndex] !== "undefined") {
        this.slider_progress_bars[this.slideIndex].style.backgroundColor =
          "white";
      }
    }
  }

  togglePlay(): void {
    this.slideshow_play_btn = "hide";
    this.video = this.video_player.nativeElement;
    clearInterval(this.mainSlide_timer);
    const el = this.playButton.nativeElement;
    if (this.video.paused) {
      this.video.play();
      el.innerHTML = "pause_circle_outline";
      this.hideControls();
    } else {
      this.slideshow_play_btn = "pause";
      this.pauseVideo();
    }
  }

  pauseVideo(): void {
    const el = this.playButton.nativeElement;
    this.video.pause();
    el.innerHTML = "play_circle_outline";
    this.showControls();
    if (this.slideshow_play_btn === "play_arrow") {
      this.slideshow_play_btn = "pause";
      this.startMainSlider();
    } else {
      this.slideshow_play_btn = "play_arrow";
      clearInterval(this.mainSlide_timer);
    }
  }

  hideControls() {
    if (typeof this.playButton !== "undefined") {
      this.slider_bar_container_fluid.nativeElement.style.top = "50vh";
      this.slider_bar_container_fluid.nativeElement.style.opacity = "0";
      this.headerCommunicationService.collapseHeader();
      this.playButton.nativeElement.style.opacity = "0";
      this.controlsOpacity = 0;
    }
  }

  showControls() {
    this.slider_bar_container_fluid.nativeElement.style.top = "46.5vh";
    this.headerCommunicationService.expendHeader();
    this.playButton.nativeElement.style.opacity = "1";
    this.slider_bar_container_fluid.nativeElement.style.opacity = "1";
    this.controlsOpacity = 1;
  }

  mouseMovingOnPlayer() {
    if (typeof this.video_player !== "undefined") {
      this.video = this.video_player.nativeElement;
      const self = this;
      const mouseStopped = function() {
        self.hideControls();
      };
      if (this.video.paused) {
        clearTimeout(this.mousemove_timer);
        this.showControls();
      } else {
        if (this.controlsOpacity === 0) {
          this.showControls();
        } else {
          clearTimeout(this.mousemove_timer);
          this.mousemove_timer = setTimeout(mouseStopped, 1500);
        }
      }
    }
  }

  private stopHidingVideoControlsTimer(): void {
    if (this.video && !this.video.paused) {
      clearTimeout(this.mousemove_timer);
    }
  }

  private startHidingVideoControlsTimer(): void {
    const mouseStopped = () => {
      this.hideControls();
    };
    if (this.video && !this.video.paused) {
      clearTimeout(this.mousemove_timer);
      this.mousemove_timer = setTimeout(mouseStopped, 1500);
    }
  }

  showSelectedSlide(slideNumber): void {
    this.hideAllSlides();
    this.slideIndex = slideNumber;
    if (this.video) {
      if (!this.video.paused) {
        this.pauseVideo();
      }
    }
    clearInterval(this.mainSlide_timer);
    this.slideshow_play_btn = "play_arrow";
    this.hideAllSlides();
    this.showSlide();
  }

  ngOnInit() {
    this.fetching = true;
    this.lang = this.activatedRoute.snapshot.data["lang"];
    if (typeof this.lang === "undefined") {
      this.paramsSubscription = this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.lang = params["lang"];
          if (typeof this.lang === "undefined") {
            this.lang = "en";
          }
          if (this.lang === "en") {
            this.read_more_text = "Read More";
          } else {
            this.read_more_text = "Läs Mer";
          }

          if (localStorage.getItem("primarySlides_sv") && this.lang === "sv") {
            this.slides = JSON.parse(localStorage.getItem("primarySlides_sv"));
            this.fetching = false;
            clearInterval(this.mainSlide_timer);
            this.startMainSlider();
          } else if (
            localStorage.getItem("primarySlides_en") &&
            this.lang === "en"
          ) {
            this.slides = JSON.parse(localStorage.getItem("primarySlides_en"));
            this.fetching = false;
            clearInterval(this.mainSlide_timer);
            this.startMainSlider();
          } else {
            this.slideSubscription = this.primarySlidesService
              .getAllPrimarySlides(this.lang)
              .subscribe(
                slides => {
                  if (slides.length !== 0) {
                    this.fetching = false;
                    clearInterval(this.mainSlide_timer);
                    this.slides = slides;
                    this.startMainSlider();
                    if (this.lang === "sv") {
                      localStorage.setItem(
                        "primarySlides_sv",
                        JSON.stringify(slides)
                      );
                    } else {
                      localStorage.setItem(
                        "primarySlides_en",
                        JSON.stringify(slides)
                      );
                    }
                  }
                  this.fetching = false;
                },
                error => {
                  this.fetching = false;
                  this.notificationBarCommunicationService.send_data(error);
                }
              );
          }
        }
      );
    } else {
      if (this.lang === "en") {
        this.read_more_text = "Read More";
      } else {
        this.read_more_text = "Läs Mer";
      }
      if (localStorage.getItem("primarySlides_sv") && this.lang === "sv") {
        this.slides = JSON.parse(localStorage.getItem("primarySlides_sv"));
        this.fetching = false;
        clearInterval(this.mainSlide_timer);
        this.startMainSlider();
      } else if (
        localStorage.getItem("primarySlides_en") &&
        this.lang === "en"
      ) {
        this.slides = JSON.parse(localStorage.getItem("primarySlides_en"));
        this.fetching = false;
        clearInterval(this.mainSlide_timer);
        this.startMainSlider();
      } else {
        this.slideSubscription = this.primarySlidesService
          .getAllPrimarySlides(this.lang)
          .subscribe(
            slides => {
              if (slides.length !== 0) {
                this.fetching = false;
                clearInterval(this.mainSlide_timer);
                this.slides = slides;
                this.showSlide();
                this.startMainSlider();
                if (this.lang === "sv") {
                  localStorage.setItem(
                    "primarySlides_sv",
                    JSON.stringify(slides)
                  );
                } else {
                  localStorage.setItem(
                    "primarySlides_en",
                    JSON.stringify(slides)
                  );
                }
              }
              this.fetching = false;
            },
            error => {
              this.fetching = false;
              this.notificationBarCommunicationService.send_data(error);
            }
          );
      }
    }

    this.headerCommunicationSub = this.headerCommunicationService.onMenuDropDownObservable$.subscribe(
      arg => {
        if (arg === "stopHidingVideoControlsTimer") {
          this.stopHidingVideoControlsTimer();
        } else if (arg === "startHidingVideoControlsTimer") {
          this.startHidingVideoControlsTimer();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.mousemove_timer) {
      clearTimeout(this.mousemove_timer);
    }
    if (this.video) {
      if (!this.video.paused) {
        this.headerCommunicationService.expendHeader();
      }
    }

    clearInterval(this.mainSlide_timer);
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.slideSubscription) {
      this.slideSubscription.unsubscribe();
    }
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
    if (this.headerCommunicationSub) {
      this.headerCommunicationSub.unsubscribe();
    }
  }
}
