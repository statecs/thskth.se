import {Component, OnInit, Input, HostListener, OnDestroy} from '@angular/core';
import { Card } from '../../interfaces-and-classes/card';
import { SocialMediaPostService } from '../../services/social-media-post/social-media-post.service';
import { SocialMediaPost } from '../../interfaces-and-classes/social_media_post';
import format from 'date-fns/format/index';
import { Event } from '../../interfaces-and-classes/event';
import { ths_calendars } from '../../utils/ths-calendars';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-cards-social-container',
  templateUrl: './cards-social-container.component.html',
  styleUrls: ['./cards-social-container.component.scss']
})
export class CardsSocialContainerComponent implements OnInit, OnDestroy {
  @Input() showFetchMoreBtn: boolean;
  public cards: Card[];
  public socialMediaPosts: SocialMediaPost[];
  public thirdCard: SocialMediaPost;
  private meta_data: SocialMediaPost[];
  public displayedCards_amount: number;
  public showEventCalendar: boolean;
  public events: Event[];

  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_index: number;
  public ths_calendars: any[];
  public existMorePosts: boolean;
  public fetching: boolean;
  public lang: string;
  public read_more: string;
  public paramsSubscription: Subscription;
  public postsSubscription: Subscription;

  constructor( private socialMediaPostService: SocialMediaPostService,
               private activatedRoute: ActivatedRoute) {
    this.displayedCards_amount = 6;
    this.showEventCalendar = false;
    this.ths_calendars = ths_calendars;
    this.existMorePosts = true;
    this.fetching = true;
    this.lang = this.activatedRoute.snapshot.data['lang'];
    if (typeof this.lang === 'undefined') {
      this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
        (this.lang === 'en' ? this.read_more = 'Read more' : this.read_more = 'Läs Mer');
      });
    }else {
      (this.lang === 'en' ? this.read_more = 'Read more' : this.read_more = 'Läs Mer');
    }

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.showFetchMoreBtn && this.meta_data) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      const max = document.documentElement.scrollHeight;
      if (pos > max - 500) {
        this.fetchMorePosts();
      }
    }
  }

  fetchMorePosts(): void {
    this.fetching = true;
    this.displayedCards_amount += 6;
    this.socialMediaPosts = this.meta_data.slice(0, this.displayedCards_amount);
    if (this.displayedCards_amount >= this.meta_data.length) {
      this.existMorePosts = false;
    }
    this.fetching = false;
  }

  formatDate(created_time): string {
    const date = new Date(created_time * 1000);
    return format(date, 'DD MMM YYYY') + ' at ' + format(date, 'hh:mma');
  }

  goToUserProfile(url): void {
    window.open(url, '_blank');
  }

  ngOnInit() {
    this.selected_event_title = '';
    this.selected_event_text = '';
    this.selected_event_index = 0;
    this.postsSubscription = this.socialMediaPostService.fetchAllPosts().subscribe(
        res => {
          this.meta_data = res;
          this.thirdCard = res[2];
          const first_six_posts = res.slice(0, this.displayedCards_amount + 1);
          first_six_posts.splice(2, 1);
          this.socialMediaPosts = first_six_posts;
          this.fetching = false;
        },
        error => {
          console.log(error);
        }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
