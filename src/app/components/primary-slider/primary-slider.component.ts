import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { PrimarySlidesService } from '../../services/wordpress/primary-slides.service';
import { Slide } from '../../interfaces/slide';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-primary-slider',
  templateUrl: './primary-slider.component.html',
  styleUrls: ['./primary-slider.component.scss']
})
export class PrimarySliderComponent implements OnInit {
  @ViewChild('primary_slider') primary_slider: ElementRef;
  @ViewChild('slides_container') slides_container: ElementRef;
  @ViewChild('video_player') video_player: ElementRef;
  @ViewChild('slider_bar_container') slider_bar_container: ElementRef;
  @ViewChild('playButton') playButton: ElementRef;

  public slides_img_base: string;
  public slider_progress_bars: any;
  public video: any;
  public controlsOpacity: number;
  public mousemove_timer: any;
  public mainSlide_timer: any;
  public slideIndex: number;
  public slides: Slide[];
  public slideshow_play_btn: string;
  public slideElements: any[];
  private lang: string;
  public read_more_text: string;

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private primarySlidesService: PrimarySlidesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.slides_img_base = '../../../assets/images/main_slider/';
    this.slideIndex = 1;
    this.slideshow_play_btn = 'pause';
  }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      this.router.navigate([slug]);
    }
  }

  startMainSlider(): void {
    const self = this;
    this.mainSlide_timer = setInterval(function () {
      self.hideAllSlides();
      self.slideIndex++;
      if (self.slideIndex > self.slides.length) {
        self.slideIndex = 1;
      }
      self.showSlide();
    }, 10000);
  }

  toggleMainSlider(): void {
    if (this.slideshow_play_btn === 'pause') {
      this.slideshow_play_btn = 'play_arrow';
      clearInterval(this.mainSlide_timer);
    }else {
      this.slideshow_play_btn = 'pause';
      this.startMainSlider();
    }
  }

  hideAllSlides(): void {
    this.slider_progress_bars = this.primary_slider.nativeElement.getElementsByClassName('slider-progress-bar');
    this.slideElements = this.slides_container.nativeElement.getElementsByClassName('slide');
    if (typeof this.slider_progress_bars !== 'undefined' && typeof this.slideElements !== 'undefined') {
      if (typeof this.slideElements[this.slideIndex - 1] !== 'undefined') {
        this.slideElements[this.slideIndex - 1].style.right = 0;
        this.slideElements[this.slideIndex - 1].style.opacity = 0;
      }
      for (let i = 0; i < this.slideElements.length; i++) {
        this.slideElements[i].style.visibility = 'hidden';
        this.slider_progress_bars[i].style.backgroundColor = 'gray';
      }
    }
  }

  showSlide(): void {
    this.slider_progress_bars = this.primary_slider.nativeElement.getElementsByClassName('slider-progress-bar');
    this.slideElements = this.slides_container.nativeElement.getElementsByClassName('slide');
    if (typeof this.slider_progress_bars !== 'undefined' && typeof this.slideElements !== 'undefined') {
      this.slideElements[this.slideIndex - 1].style.visibility = 'visible';
      this.slideElements[this.slideIndex - 1].style.opacity = 1;
      /*if (this.slideIndex === 2) {
        this.primary_slider.nativeElement.style.backgroundImage = 'none';
      }else {
        this.primary_slider.nativeElement.style.backgroundImage = 'url("' + this.slides[this.slideIndex - 1].bg_image + '")';
      }*/
      this.primary_slider.nativeElement.style.backgroundImage = 'url("' + this.slides[this.slideIndex - 1].bg_image + '")';
      this.slider_progress_bars[this.slideIndex - 1].style.backgroundColor = 'white';
    }
  }

  togglePlay(e): void {
    this.video = this.video_player.nativeElement;
    clearInterval(this.mainSlide_timer);
    const el = this.playButton.nativeElement;
    if (this.video.paused) {
      this.video.play();
      el.innerHTML = 'pause_circle_outline';
      this.hideControls();
    }else {
      this.video.pause();
      el.innerHTML = 'play_circle_outline';
      this.showControls();
      this.startMainSlider();
    }
  }

  hideControls() {
    this.slider_bar_container.nativeElement.style.bottom = '-100px';
    this.headerCommunicationService.collapeHeader();
    this.playButton.nativeElement.style.opacity = '0';
    this.controlsOpacity = 0;
  }

  showControls() {
    this.slider_bar_container.nativeElement.style.bottom = '0';
    this.headerCommunicationService.expendHeader();
    this.playButton.nativeElement.style.opacity = '1';
    this.controlsOpacity = 1;
  }

  mouseMovingOnPlayer() {
    if (typeof this.video_player !== 'undefined') {
      this.video = this.video_player.nativeElement;
      const self = this;
      const mouseStopped = function(){
        self.hideControls();
      };
      if (this.video.paused) {
        clearTimeout( this.mousemove_timer );
        this.showControls();
      }else {
        if (this.controlsOpacity === 0) {
          this.showControls();
        }else {
          clearTimeout(this.mousemove_timer);
          this.mousemove_timer = setTimeout(mouseStopped, 1500);
        }
      }
    }
  }

  showSelectedSlide(slideNumber): void {
    this.slideIndex = slideNumber;
      clearInterval(this.mainSlide_timer);
      if (this.slideshow_play_btn === 'pause') {
          this.hideAllSlides();
          this.showSlide();
          this.startMainSlider();
      }else {
          this.hideAllSlides();
          this.showSlide();
      }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      console.log(this.lang);
      if (this.lang === 'en') {
        this.read_more_text = 'Read More';
      }else {
        this.read_more_text = 'Läs Mer';
      }
      this.primarySlidesService.getAllPrimarySlides(this.lang).subscribe((slides) => {
            this.slides = slides;
            this.startMainSlider();
          },
          (error) => {
            this.notificationBarCommunicationService.send_data(error);
          });
    });
  }

}
