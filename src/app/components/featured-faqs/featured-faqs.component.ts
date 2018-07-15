import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { most_asked_questions } from '../../utils/most-asked-questions';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { FAQ } from '../../interfaces-and-classes/faq';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-featured-faqs',
  templateUrl: './featured-faqs.component.html',
  styleUrls: ['./featured-faqs.component.scss']
})
export class FeaturedFaqsComponent implements OnInit, OnDestroy {
  //@Input() lang: any;
  @ViewChild('slides_wrapper') slides_wrapper: ElementRef;
  public most_asked_questions_slugs: string[];
  public most_asked_faqs: FAQ[];
  private swipeCoord: [number, number];
  private swipeTime: number;
  public item_onfocus_index: number;
  public faqsSubscription: Subscription;
  public faqsSubscription2: Subscription;
  public faqsSubscription3: Subscription;
  public paramsSubscription: Subscription;
  public lang: string;

  constructor(private faqsService: FaqsService,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private activatedRoute: ActivatedRoute) {
    this.most_asked_questions_slugs = most_asked_questions;
    this.most_asked_faqs = [];
    this.item_onfocus_index = 0;
  }

  showInPopup(faq: FAQ): void {
    this.popupWindowCommunicationService.showFaqInPopup(faq);
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 // Short enough
          && Math.abs(direction[1]) < Math.abs(direction[0]) // Horizontal enough
          && Math.abs(direction[0]) > 30) {  // Long enough
        if (direction[0] < 0) {
          if (this.item_onfocus_index < this.most_asked_faqs.length - 1) {
            this.item_onfocus_index += 1;
            this.swipeForward();
          }
        }else {
          if (this.item_onfocus_index > 0) {
            this.item_onfocus_index -= 1;
            this.swipeBackward();
          }
        }
      }
    }
  }

  swipeForward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    if (slides_wrapper.style.marginLeft) {
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) - 83) + '%';
    }else {
      margin_left = '-80%';
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  swipeBackward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    if (slides_wrapper.style.marginLeft) {
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) + 83) + '%';
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  getFAQs(): void {
    this.faqsSubscription = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[0], this.lang).subscribe((faq) => {
          const faqs: FAQ[] = [];
          faqs.push(faq);
          this.faqsSubscription2 = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[1], this.lang).subscribe((faq2) => {
                faqs.push(faq2);
                this.faqsSubscription3 = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[2], this.lang).subscribe((faq3) => {
                      faqs.push(faq3);

                      this.most_asked_faqs = faqs;
                    },
                    (error) => {
                      this.most_asked_faqs = [];
                      this.notificationBarCommunicationService.send_data(error);
                    });
              },
              (error) => {
                this.most_asked_faqs = [];
                this.notificationBarCommunicationService.send_data(error);
              });
        },
        (error) => {
          this.most_asked_faqs = [];
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this.getFAQs();
    });
  }

  ngOnDestroy() {
    if (this.faqsSubscription) {
      this.faqsSubscription.unsubscribe();
    }
    if (this.faqsSubscription2) {
      this.faqsSubscription2.unsubscribe();
    }
    if (this.faqsSubscription3) {
      this.faqsSubscription3.unsubscribe();
    }
  }
}
