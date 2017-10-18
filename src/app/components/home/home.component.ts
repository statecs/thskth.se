import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CardCategorizerComponent } from '../card-categorizer/card-categorizer.component';
import { CardsContainerComponent } from '../cards-container/cards-container.component';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { PostsService } from '../../services/wordpress/posts.service';
import { ImageSliderCommunicationService } from '../../services/component-communicators/image-slider-communication.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private lang: string;

  constructor(  private wordpressApiService: WordpressApiService,
                private textSliderCommunicationService: TextSliderCommunicationService,
                private faqsService: FaqsService,
                private postsService: PostsService,
                private imageSliderCommunicationService: ImageSliderCommunicationService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private _cookieService: CookieService) {

      this.activatedRoute.params.subscribe((params: Params) => {
          this.lang = params['lang'];
          if (this.lang === 'en') {
              console.log('pass: ' + this.lang);
              this.router.navigate(['']);
          }else if (typeof this.lang === 'undefined') {
              this.lang = 'en';
          }
          this._cookieService.put('language', this.lang);
      });
  }

  ngOnInit() {
      this.faqsService.getFAQs_OfEachCategories(1).subscribe((faqs) => {
          this.textSliderCommunicationService.send_data_to_textSlider(faqs);
      });
      this.postsService.getPosts(5).subscribe((posts) => {
          this.imageSliderCommunicationService.send_data_to_imageSlider(posts);
      });
  }

}
