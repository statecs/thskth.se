import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { SearchService } from '../../services/wordpress/search.service';
import { SearchResult } from '../../interfaces/search';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import {Location} from '@angular/common';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { FAQ, FAQCategory } from '../../interfaces/faq';
import { most_asked_questions } from '../../utils/most-asked-questions';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';
import {HideUICommunicationService} from '../../services/component-communicators/hide-ui-communication.service';
import {RemoveLangParamPipe} from '../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../pipes/add-lang-to-slug.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {


  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('resultsDropdownList') resultsDropdownList: ElementRef;

  public postsChecked: boolean;
  public pageChecked: boolean;
  public faqChecked: boolean;
  public showFilterOptions: boolean;
  public searchOnFocus: boolean;
  public searchTerm: string;
  public mostSearchTerms: string[];
  public pageResults: SearchResult[];
  public postsResults: SearchResult[];
  public faqResults: SearchResult[];
  private hrefToSlugPipeFilter: HrefToSlugPipe;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public showResultsDropdown: boolean;
  public postsLoading: boolean;
  public pagesLoading: boolean;
  public faqsLoading: boolean;
  public showResults: boolean;

  public parent_categories: FAQCategory[];
  public most_asked_faqs: FAQ[];
  public most_asked_questions_slugs: string[];

  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public postSubscription: Subscription;
  public pageSubscription: Subscription;
  public faqsSubscription: Subscription;
  public queryParamsSubscription: Subscription;
  public faqCatSubscription: Subscription;
  public faqsSubscription2: Subscription;
  public faqsSubscription3: Subscription;
  public faqsSubscription4: Subscription;
  public hideUiSubscription: Subscription;
  public timer: any;

  constructor(private searchService: SearchService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private faqsService: FaqsService,
              private renderer: Renderer2,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private titleCommunicationService: TitleCommunicationService,
              private headerCommunicationService: HeaderCommunicationService,
              private hideUiCommunicationService: HideUICommunicationService) {
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    this.searchTerm = '';
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.hrefToSlugPipeFilter = new HrefToSlugPipe();
    this.pageResults = [];
    this.postsResults = [];
    this.faqResults = [];
    this.showResultsDropdown = false;
    this.postsLoading = true;
    this.pagesLoading = true;
    this.faqsLoading = true;
    this.showResults = false;
    this.most_asked_questions_slugs = most_asked_questions;
    this.parent_categories = [];
    this.most_asked_faqs = [];
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.pageNotFound = false;
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      if (this.lang === 'sv') {
        this.titleCommunicationService.setTitle('Sök');
      }else {
        this.titleCommunicationService.setTitle('Search');
      }
    });

    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
  }

  goToPage(link, type): void {
    if (type === 'faq') {
      this.router.navigate([this.lang + '/support/faqs/' + link]);
    }
    if (type === 'post') {
      this.router.navigate([this.lang + '/news/' + link]);
    }
    if (type === 'page') {
      let slug = link;
      if (slug.substring(slug.length - 9) === '/?lang=en' || slug.substring(slug.length - 9) === '/?lang=sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      if (slug.substring(slug.length - 8) === '?lang=en' || slug.substring(slug.length - 8) === '?lang=sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }
  }

  submitSearch(): void {
    this.showResultsDropdown = false;
    this.showResults = true;
    this.search();
  }

  liveSearch(event): void {
    if (event.keyCode !== 13) {
      this.pageResults = [];
      this.postsResults = [];
      this.faqResults = [];
      this.postsLoading = true;
      this.pagesLoading = true;
      this.faqsLoading = true;
      this.showResultsDropdown = true;
      this.showResults = false;
      this.search();
    }
  }

  search(): void {
    if (this.postsChecked) {
      this.searchPosts();
    }
    if (this.pageChecked) {
      this.searchPages();
    }
    if (this.faqChecked) {
      this.searchFAQs();
    }
    if (this.searchTerm !== '' && typeof this.searchTerm !== 'undefined') {
      if (this.lang === 'sv') {
        this.location.go('sv/search?q=' + this.searchTerm);
      }else {
        this.location.go('en/search?q=' + this.searchTerm);
      }
    }
  }

  searchPosts(): void {
    this.postSubscription = this.searchService.searchPosts(this.searchTerm, 4, this.lang).subscribe((res) => {
          this.postsLoading = false;
          this.postsResults = res;
        },
        (error) => {
          this.postsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  searchPages(): void {
    this.pageSubscription = this.searchService.searchPages(this.searchTerm, 4, this.lang).subscribe((res) => {
          this.pagesLoading = false;
          this.pageResults = res;
        },
        (error) => {
          this.pagesLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  searchFAQs(): void {
    this.faqsSubscription = this.searchService.searchFAQs(this.searchTerm, 4, this.lang).subscribe((res) => {
          this.faqsLoading = false;
          this.faqResults = res;
        },
        (error) => {
          this.faqsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  selectTerm(term): void {
    this.searchTerm = term;
    this.search();
    this.showResultsDropdown = true;
  }

  toggleSearchFocus(): void {
    (this.searchOnFocus ? this.searchOnFocus = false : this.searchOnFocus = true);
  }

  toggleFilter(): void {
    if (this.showFilterOptions) {
      this.showFilterOptions = false;
      this.filter_icon.nativeElement.style.color = 'lightgray';
    }else {
      this.showFilterOptions = true;
      this.filter_icon.nativeElement.style.color = 'rgba(0, 108, 170, 0.62)';
    }
  }

  toggleCheckbox(optId): void {
    if (optId === 'posts') {
      (this.postsChecked ? this.postsChecked = false : this.postsChecked = true);
    }else if (optId === 'page') {
      (this.pageChecked ? this.pageChecked = false : this.pageChecked = true);
    }else if (optId === 'faq') {
      (this.faqChecked ? this.faqChecked = false : this.faqChecked = true);
    }
    this.search();
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['q'];
      if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
        this.submitSearch();
      }
    });

    this.faqCatSubscription = this.faqsService.getFAQParentCategories(this.lang).subscribe((categories) => {
          this.parent_categories = categories;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });

    this.faqsSubscription2 = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[0], this.lang).subscribe((faq) => {
      const faqs: FAQ[] = [];
      faqs.push(faq);
      this.faqsSubscription3 = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[1], this.lang).subscribe((faq2) => {
        faqs.push(faq2);
        this.faqsSubscription4 = this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[2], this.lang).subscribe((faq3) => {
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

    const self = this;
    this.timer = setInterval(function () {
      if (self.searchTerm) {
        clearInterval(self.timer);
        self.renderer.listen(self.searchField.nativeElement, 'search', () => {
          if (self.searchTerm === '') {
            if (self.lang === 'sv') {
              self.location.go('sv/search');
            }else {
              self.location.go('en/search');
            }
            self.showResults = false;
          }
        });
      }
    }, 100);

    this.hideUiSubscription = this.hideUiCommunicationService.hideUIObservable$.subscribe((event) => {
      if (this.resultsDropdownList) {
        if (this.resultsDropdownList.nativeElement !== event.target && !this.resultsDropdownList.nativeElement.contains(event.target)) {
          this.showResultsDropdown = false;
        }
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
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
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.faqCatSubscription) {
      this.faqCatSubscription.unsubscribe();
    }
    if (this.faqsSubscription2) {
      this.faqsSubscription2.unsubscribe();
    }
    if (this.faqsSubscription3) {
      this.faqsSubscription3.unsubscribe();
    }
    if (this.faqsSubscription4) {
      this.faqsSubscription4.unsubscribe();
    }
    if (this.hideUiSubscription) {
      this.hideUiSubscription.unsubscribe();
    }
  }
}
