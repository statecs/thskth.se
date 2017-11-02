import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { most_asked_questions } from '../../utils/most-asked-questions';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { FAQ } from '../../interfaces/faq';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-featured-faqs',
  templateUrl: './featured-faqs.component.html',
  styleUrls: ['./featured-faqs.component.scss']
})
export class FeaturedFaqsComponent implements OnInit {

  @ViewChild('slides_wrapper') slides_wrapper: ElementRef;
  public most_asked_questions_slugs: string[];
  public most_asked_faqs: FAQ[];
  private swipeCoord: [number, number];
  private swipeTime: number;
  public item_onfocus_index: number;

  constructor(private faqsService: FaqsService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.most_asked_questions_slugs = most_asked_questions;
    this.most_asked_faqs = [];
    this.item_onfocus_index = 0;
  }

  swipe(e: TouchEvent, when: string): void {
    console.log(when);
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
            console.log(this.item_onfocus_index);
            this.swipeForward();
          }
        }else {
          if (this.item_onfocus_index > 0) {
            this.item_onfocus_index -= 1;
            this.swipeBackward();
            console.log(this.item_onfocus_index);
          }
        }
        // Do whatever you want with swipe
      }
    }
  }

  swipeForward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    console.log('swipeForward');
    if (slides_wrapper.style.marginLeft) {
      console.log(parseFloat(slides_wrapper.style.marginLeft));
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) - 83) + '%';
      console.log(margin_left);
    }else {
      margin_left = '-80%';
      console.log(margin_left);
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  swipeBackward(): void {
    const slides_wrapper = this.slides_wrapper.nativeElement;
    let margin_left = '';
    console.log('swipeForward');
    if (slides_wrapper.style.marginLeft) {
      console.log(parseFloat(slides_wrapper.style.marginLeft));
      margin_left = (parseFloat(slides_wrapper.style.marginLeft) + 83) + '%';
      console.log(margin_left);
    }
    slides_wrapper.style.marginLeft = margin_left;
  }

  ngOnInit() {
    this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[0]).subscribe((faq) => {
      const faqs: FAQ[] = [];
      faqs.push(faq);
      this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[1]).subscribe((faq2) => {
        faqs.push(faq2);
        this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[2]).subscribe((faq3) => {
          faqs.push(faq3);

          this.most_asked_faqs = faqs;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
      },
      (error) => {
        this.notificationBarCommunicationService.send_data(error);
      });
    },
    (error) => {
      this.notificationBarCommunicationService.send_data(error);
    });
  }

}
