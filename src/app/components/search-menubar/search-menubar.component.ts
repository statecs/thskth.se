import {Component, OnInit, OnDestroy} from '@angular/core';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import { SearchService } from '../../services/wordpress/search.service';
import { SearchResult } from '../../interfaces-and-classes/search';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie';
import {PostsService} from '../../services/wordpress/posts.service';
import {PagesService} from '../../services/wordpress/pages.service';
import {FaqsService} from '../../services/wordpress/faqs.service';

@Component({
  selector: 'app-search-menubar',
  templateUrl: './search-menubar.component.html',
  styleUrls: ['./search-menubar.component.scss']
})
export class SearchMenubarComponent implements OnInit, OnDestroy {
  public mostSearchTerms: string[];
  public showSearchBar: boolean;
  public pageResults: SearchResult[];
  public postsResults: SearchResult[];
  public faqResults: SearchResult[];
  public postsLoading: boolean;
  public pagesLoading: boolean;
  public faqsLoading: boolean;
  public searchTerm: string;
  public showResultsDropdown: boolean;
  private lang: string;
  public paramsSubscription: Subscription;
  public postSubscription: Subscription;
  public pageSubscription: Subscription;
  public faqsSubscription: Subscription;
  public menuBarSubscription: Subscription;

  constructor(private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private searchService: SearchService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private _cookieService: CookieService,
              private postsService: PostsService,
              private pagesService: PagesService,
              private faqsService: FaqsService) {
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.showSearchBar = false;
    this.showResultsDropdown = false;
    this.pageResults = [];
    this.postsResults = [];
    this.faqResults = [];
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  goToPage(link, type): void {
    this.hideBar();
    if (type === 'faq') {
      this.router.navigate([this.lang + '/support/faqs/' + link]);
    }
    if (type === 'post') {
      this.router.navigate([this.lang + '/news/' + link]);
    }
    if (type === 'page') {
      this.router.navigate(['/' + link]);
    }
  }

  goToSearchPage(): void {
    this.hideBar();
    let slug = '';
    if (this.lang === 'sv') {
      slug = 'sv/search';
    }else {
      slug = 'en/search';
    }
    this.router.navigate([slug], { queryParams: { q: this.searchTerm } });
  }

  showBar(): void {
    this.showSearchBar = true;
  }

  closeBar(): void {
    this._cookieService.remove('search-menubar-terms');
    this.hideBar();
  }

  hideBar(): void {
    this.showSearchBar = false;
  }

  liveSearch(): void {
    if (this.searchTerm !== '') {
      this.searchPosts();
      this.searchPages();
      this.searchFAQs();
      this.showResultsDropdown = true;
      this._cookieService.put('search-menubar-terms', this.searchTerm);
    }else {
      this.showResultsDropdown = false;
    }
  }

  searchPosts(): void {
    this.postSubscription = this.postsService.searchPosts(this.searchTerm, 2, this.lang).subscribe((res) => {
          this.postsLoading = false;
          this.postsResults = res;
        },
        (error) => {
          this.postsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  searchPages(): void {
    this.pageSubscription = this.pagesService.searchPages(this.searchTerm, 2, this.lang).subscribe((res) => {
          this.pagesLoading = false;
          this.pageResults = res;
        },
        (error) => {
          this.pagesLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  searchFAQs(): void {
    this.faqsSubscription = this.faqsService.searchFAQs(this.searchTerm, 2, this.lang).subscribe((res) => {
          this.faqsLoading = false;
          this.faqResults = res;
        },
        (error) => {
          this.faqsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    this.menuBarSubscription = this.searchMenubarCommunicationService.notifyObservable$.subscribe(() => {
      this.showBar();
      const search_term = this._cookieService.get('search-menubar-terms');
      if (search_term) {
        this.searchTerm = search_term;
        this.liveSearch();
      }else {
        this.searchTerm = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.faqsSubscription) {
      this.faqsSubscription.unsubscribe();
    }
    if (this.menuBarSubscription) {
      this.menuBarSubscription.unsubscribe();
    }
  }

}
