import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('main_slider') main_slider: ElementRef;
    @ViewChild('slides_container') slides_container: ElementRef;
    @ViewChild('video_player') video_player: ElementRef;
    @ViewChild('slider_bar_container') slider_bar_container: ElementRef;
    @ViewChild('playButton') playButton: ElementRef;
    @ViewChild('app_header') app_header: ElementRef;

    public slides_images: string[];
    public slides_img_base: string;
    public slider_progress_bars: any;
    public video: any;
    public controlsOpacity: number;
    public mousemove_timer: any;
    public mainSlide_timer: any;
    public slideIndex: number;
    public slides: any;

  constructor( private wordpressApiService: WordpressApiService) {
      this.slides_images = ['Background-image-733x550.jpg', 'none', '35_kth_vlv_6y7b5608-825x550.jpg', 'big-banner.jpg', 'LoggaBild.png'];
      this.slides_img_base = '../../../assets/images/main_slider/';
      this.slideIndex = 1;
  }

  startMainSlider(): void {
      console.log('startMainSlider');
      const self = this;
      this.mainSlide_timer = setInterval(function () {
          self.hideAllSlides();
          self.slideIndex++;
          if (self.slideIndex > self.slides.length) {
              self.slideIndex = 1;
          }
          self.showSlide();
      }, 5000);
  }

  hideAllSlides(): void {
      this.slides[this.slideIndex - 1].style.right = 0;
      for (let i = 0; i < this.slides.length; i++) {
          this.slides[i].style.visibility = 'hidden';
          this.slides[this.slideIndex - 1].style.opacity = 0;
          this.slider_progress_bars[i].style.backgroundColor = 'gray';
      }
  }

  showSlide(): void {
      this.slides[this.slideIndex - 1].style.visibility = 'visible';
      this.slides[this.slideIndex - 1].style.opacity = 1;
      if (this.slideIndex === 2) {
          this.main_slider.nativeElement.style.backgroundImage = 'none';
      }else {
          this.main_slider.nativeElement.style.backgroundImage = 'url("' + this.slides_img_base + this.slides_images[this.slideIndex - 1] + '")';
      }
      this.slider_progress_bars[this.slideIndex - 1].style.backgroundColor = 'white';
  }

    togglePlay(e): void {
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
        this.app_header.nativeElement.style.top = '-150px';
        this.playButton.nativeElement.style.opacity = '0';
        this.controlsOpacity = 0;
    }

    showControls() {
        this.slider_bar_container.nativeElement.style.bottom = '0';
        this.app_header.nativeElement.style.top = '0';
        this.playButton.nativeElement.style.opacity = '1';
        this.controlsOpacity = 1;
    }

    mouseMovingOnPlayer() {
        const self = this;
        const mouseStopped = function(){
            self.hideControls();
        };
        if (this.video.paused) {
            if (this.controlsOpacity !== 1) {
                clearTimeout( this.mousemove_timer );
                this.showControls();
            }
        }else {
            if (this.controlsOpacity === 0) {
                this.showControls();
            }else {
                clearTimeout(this.mousemove_timer);
                this.mousemove_timer = setTimeout(mouseStopped, 1500);
            }
        }
    }

    showSelectedSlide(slideNumber): void {
      console.log( this.slideIndex);
      this.slideIndex = slideNumber;
      console.log(slideNumber);
      clearInterval(this.mainSlide_timer);
      this.hideAllSlides();
      this.showSlide();
      this.startMainSlider();
    }

  ngOnInit() {
      this.slider_progress_bars = this.main_slider.nativeElement.getElementsByClassName('slider-progress-bar');
      this.slider_progress_bars[0].style.backgroundColor = 'white';

      this.video = this.video_player.nativeElement;

      this.slides = this.slides_container.nativeElement.getElementsByClassName('slide');

    this.wordpressApiService.getCards()
        .subscribe(res => {
          console.log(res);
        });

    this.startMainSlider();
  }

}
