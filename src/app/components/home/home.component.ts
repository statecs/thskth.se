import {Component, OnInit, OnDestroy} from '@angular/core';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { PostsService } from '../../services/wordpress/posts.service';
import { ImageSliderCommunicationService } from '../../services/component-communicators/image-slider-communication.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private lang: string;
    public pageNotFound: boolean;
    public paramsSubscription: Subscription;
    public faqCatSubscription: Subscription;
    public postsSubscription: Subscription;

  constructor(  private textSliderCommunicationService: TextSliderCommunicationService,
                private faqsService: FaqsService,
                private postsService: PostsService,
                private imageSliderCommunicationService: ImageSliderCommunicationService,
                private activatedRoute: ActivatedRoute,
                private notificationBarCommunicationService: NotificationBarCommunicationService,
                private titleCommunicationService: TitleCommunicationService) {
      this.pageNotFound = false;
      this.lang = activatedRoute.snapshot.data['lang'];
  }

  ngOnInit() {
      this.titleCommunicationService.setTitle('THS');
      this.faqCatSubscription = this.faqsService.getFAQs_OfEachCategories(1, this.lang).subscribe((faqs) => {
              this.textSliderCommunicationService.send_data_to_textSlider(faqs);
          },
          (error) => {
              this.notificationBarCommunicationService.send_data(error);
          });
      this.postsSubscription = this.postsService.getPosts(5, this.lang).subscribe((posts) => {
              this.imageSliderCommunicationService.send_data_to_imageSlider(posts);
          },
          (error) => {
              this.notificationBarCommunicationService.send_data(error);
          });
  }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
        if (this.faqCatSubscription) {
            this.faqCatSubscription.unsubscribe();
        }
        if (this.postsSubscription) {
            this.postsSubscription.unsubscribe();
        }
    }
}
