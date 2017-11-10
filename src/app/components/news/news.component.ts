import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {Subscription} from 'rxjs/Subscription';
import {PostsService} from '../../services/wordpress/posts.service';
import {Post} from '../../interfaces/post';
import format from 'date-fns/format/index';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {

  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public posts: Post[];
  public slug: string;

  constructor(private activatedRoute: ActivatedRoute,
              private _cookieService: CookieService,
              private postsService: PostsService,
              private router: Router,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private titleCommunicationService: TitleCommunicationService) {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      this.slug = params['slug'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      if (this.lang === 'sv') {
        this.titleCommunicationService.setTitle('Nyheter');
      }else {
        this.titleCommunicationService.setTitle('News');
      }
    });
  }

  goToPage(slug): void {
    this.router.navigate([this.lang + '/news/' + slug]);
  }

  formatDate(date) {
    return format(date, 'MMM DD');
  }

  showArticleInPopup(): void {
    console.log(this.slug);
    this.popupWindowCommunicationService.showNewsInPopup(null);
    this.postsService.getPostBySlug(this.slug, this.lang).subscribe((res) => {
      console.log(res);
      const arg = {
        article: res,
        page_location: 'news'
      };
      this.popupWindowCommunicationService.showNewsInPopup(arg);
    });
  }

  ngOnInit() {
    this.postsService.getPosts(15, this.lang).subscribe((res) => {
      this.posts = res;
      console.log(res);
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
