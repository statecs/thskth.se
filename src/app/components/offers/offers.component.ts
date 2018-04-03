import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {PostsService} from '../../services/wordpress/posts.service';
import {Post} from '../../interfaces/post';
import format from 'date-fns/format/index';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';
import {HeaderCommunicationService} from "../../services/component-communicators/header-communication.service";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy {

  public lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public posts: Post[];
  public slug: string;

  constructor(private activatedRoute: ActivatedRoute,
              private postsService: PostsService,
              private router: Router,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private titleCommunicationService: TitleCommunicationService,
              private headerCommunicationService: HeaderCommunicationService) {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.pageNotFound = false;
      this.lang = params['lang'];
      this.slug = params['slug'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      if (this.lang === 'sv') {
        this.titleCommunicationService.setTitle('Erbjudanden');
      }else {
        this.titleCommunicationService.setTitle('Offers');
      }
    });
  }

  goToPage(slug): void {
    this.router.navigate([this.lang + '/offers/' + slug]);
  }

  formatDate(date) {
    return format(date, 'MMM DD');
  }

  showArticleInPopup(): void {
    this.popupWindowCommunicationService.showNewsInPopup(null);
    this.postsService.getPostBySlug(this.slug, this.lang).subscribe((res) => {
      const arg = {
        article: res,
        page_location: 'offers'
      };
      this.popupWindowCommunicationService.showNewsInPopup(arg);
    });
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.postsService.getOffers(15, this.lang).subscribe((res) => {
      this.posts = res;
    });
    this.paramsSubscription2 = this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.showArticleInPopup();
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.paramsSubscription2) {
      this.paramsSubscription2.unsubscribe();
    }
  }

}
