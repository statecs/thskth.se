import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ArchiveService } from '../../services/wordpress/archive.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import {Archive, SearchParams} from '../../interfaces/archive';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import format from 'date-fns/format/index';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';
import {HideUICommunicationService} from '../../services/component-communicators/hide-ui-communication.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, OnDestroy {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;
/*  @ViewChild('filters') filters: ElementRef;*/
  @ViewChild('searchField') searchField: ElementRef;

  public postsChecked: boolean;
  public pageChecked: boolean;
  public faqChecked: boolean;
  public showFilterOptions: boolean;
  public searchOnFocus: boolean;
  public searchTerm: string;
  public mostSearchTerms: string[];
  public documentResults: Archive[];
  public searchResults: Archive[];
  public latestDocuments: Archive[];
  private hrefToSlugPipeFilter: HrefToSlugPipe;
  public showResultsDropdown: boolean;
  public documentsLoading: boolean;
  public showResults: boolean;
  public displayedDropdown: boolean;
  public dropdowns: any;
  public displayedDropdownID: number;
  public content_typeIsDisabled: boolean;
  public showFilters: boolean;
  public docChecked: boolean;
  public zipChecked: boolean;
  public pdfChecked: boolean;
  public categoryID: number;
  public start_date: string;
  public end_date: string;
  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;
  public documentsSubscription: Subscription;
  public documentsSubscription2: Subscription;
  public queryParamsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public hideOverlappingUIsSubscription: Subscription;
  public slug: string;
  public showMostSearchTerms: boolean;
  public clickCount: number;

  constructor(private archiveService: ArchiveService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private renderer: Renderer2,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private titleCommunicationService: TitleCommunicationService,
              private headerCommunicationService: HeaderCommunicationService,
              private hideUICommunicationService: HideUICommunicationService) {
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    //this.searchTerm = '';
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.hrefToSlugPipeFilter = new HrefToSlugPipe();
    this.documentResults = [];
    this.searchResults = [];
    this.latestDocuments = [];
    this.showMostSearchTerms = true;
    this.showResultsDropdown = false;
    this.documentsLoading = true;
    this.showResults = false;
    this.displayedDropdown = false;
    this.content_typeIsDisabled = false;
    this.showFilters = true;
    this.docChecked = true;
    this.zipChecked = true;
    this.pdfChecked = true;
    this.categoryID = 0;
    this.start_date = '2014-09-24';
    this.clickCount = 0;
    this.end_date = format(new Date(), 'YYYY-MM-DD');
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      if (this.lang === 'sv') {
        this.titleCommunicationService.setTitle('Arkiv');
      }else {
        this.titleCommunicationService.setTitle('Archives');
      }
    });
  }


  showDocumentInPopup(item): void {
    this.popupWindowCommunicationService.showArchiveInPopup(item);
    if (this.lang === 'sv') {
      this.location.go('sv/archive/' + item.slug);
    }else {
      this.location.go('en/archive/' + item.slug);
    }
  }

  filterTopic(event, categoryID): void {
    event.stopPropagation();
    this.hideAllDropdown();
    this.categoryID = categoryID;
    this.searchDocuments();
    this.showResults = true;
  }

  filterDate(): void {
    this.searchDocuments();
    this.showResults = true;
  }

  toggleDropdown(param, event): void {
    event.stopPropagation();
    if (this.displayedDropdown) {
      this.hideAllDropdown();
    }else {
      this.dropdowns[param - 1].style.display = 'block';
      this.displayedDropdown = true;
    }
    if (this.displayedDropdownID !== param) {
      this.dropdowns[param - 1].style.display = 'block';
      this.displayedDropdown = true;
    }
    this.displayedDropdownID = param;
  }

  hideAllDropdown(): void {
    for (let i = 0; i < this.dropdowns.length; i++) {
      this.dropdowns[i].style.display = 'none';
    }
    this.displayedDropdown = false;
  }

  goToPage(slug): void {
    slug = this.hrefToSlugPipeFilter.transform(slug);
    this.router.navigate([slug]);
  }

  submitSearch(): void {
    this.showResultsDropdown = false;
    this.showMostSearchTerms = true;
    this.showResults = true;
    this.showFilters = true;
    this.documentResults = this.searchResults;
    this.searchResults = [];
  }

  liveSearch(event): void {
    this.documentsLoading = true;
    if (event.keyCode !== 13 && this.searchTerm !== '') {
      this.searchResults = [];
      this.showMostSearchTerms = false;
      const self = this;
      const timer = setTimeout(function () {
        self.showResultsDropdown = true;
        clearTimeout(timer);
      }, 50);
      this.showFilters = false;
      this.showResults = false;
      this.search();
    }
    if (this.searchTerm === '') {
      this.searchResults = [];
      this.showMostSearchTerms = true;
      if (this.lang === 'sv') {
        this.location.go('sv/archive?q=');
      }else {
        this.location.go('en/archive?q=');
      }
      this.documentsLoading = false;
      this.showResultsDropdown = false;
    }
  }

  search(): void {
    if (this.postsChecked) {
      this.searchDocuments();
    }
    if (this.lang === 'sv') {
      this.location.go('sv/archive?q=' + this.searchTerm);
    }else {
      this.location.go('en/archive?q=' + this.searchTerm);
    }

  }

  searchDocuments(): void {
    this.searchResults = [];
    const searchParams: SearchParams = {
      searchTerm: this.searchTerm,
      categoryID: this.categoryID,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.documentsSubscription = this.archiveService.searchDocuments(searchParams, this.lang).subscribe(
        (res) => {
          this.documentsLoading = false;
          this.searchResults = [];
          this.searchResults = res;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getDocument(): void {
    this.searchResults = [];
    const searchParams: SearchParams = {
      searchTerm: this.searchTerm,
      categoryID: this.categoryID,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.documentsSubscription = this.archiveService.searchDocuments(searchParams, this.lang).subscribe(
        (res) => {
          this.documentResults = res;
          this.showResults = true;
          this.documentsLoading = false;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  selectTerm(term): void {
    this.searchResults = [];
    this.searchTerm = term;
    this.search();
    this.showMostSearchTerms = false;
    this.showResultsDropdown = true;
    this.showFilters = false;
  }

  toggleSearchFocus(): void {
    (this.searchOnFocus ? this.searchOnFocus = false : this.searchOnFocus = true);
  }

  downloadFile(url: string) {
    window.open(url);
  }

  getDocuments(): void {
    this.documentsSubscription2 = this.archiveService.getDocuments(10, this.lang).subscribe(
        (res) => {
          this.documentsLoading = false;
          this.documentResults = res;
          this.latestDocuments = res;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getArchiveBySlug(): void {
    this.documentsSubscription2 = this.archiveService.getArchiveBySlug(this.slug, this.lang).subscribe(
        (res) => {
          this.popupWindowCommunicationService.showArchiveInPopup(res);
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    if (!this.pageNotFound) {
      this.paramsSubscription2 = this.activatedRoute.params.subscribe((params: Params) => {
        this.pageNotFound = false;
        this.slug = params['slug'];
        this.popupWindowCommunicationService.showLoader();
        if (this.slug !== 'undefined' && typeof this.slug !== 'undefined') {
          this.getDocuments();
          this.getArchiveBySlug();
        }
      });

      this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.searchTerm = params['q'];
        if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
          //this.submitSearch();
          this.getDocument();
        }
      });
      const self = this;
      /*      const timer = setInterval(function () {
        if (self.filters) {
          clearInterval(timer);
          self.dropdowns = self.filters.nativeElement.getElementsByClassName('dropdown-container');
        }
      }, 100);*/

      const timer2 = setInterval(function () {
        if (self.searchField) {
          clearInterval(timer2);
          self.renderer.listen(self.searchField.nativeElement, 'search', () => {
            if (self.searchTerm === '') {
              if (self.lang === 'sv') {
                self.location.go('sv/archive?q=' + self.searchTerm);
              }else {
                self.location.go('en/archive?q=' + self.searchTerm);
              }
              self.showFilters = true;
              self.showResults = false;
              self.showMostSearchTerms = true;
              self.documentResults = self.latestDocuments;
            }
          });
        }
      }, 100);
      
      if (this.searchTerm === 'undefined' || typeof this.searchTerm === 'undefined') {
        this.getDocuments();
      }

      this.end_date = format(new Date(), 'YYYY-MM-DD');
    }

    this.hideOverlappingUIsSubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(() => {
      if (this.clickCount === 0 && this.showResultsDropdown) {
        this.showResultsDropdown = false;
        this.showMostSearchTerms = true;
      }else {
        this.clickCount = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.documentsSubscription) {
      this.documentsSubscription.unsubscribe();
    }
    if (this.documentsSubscription2) {
      this.documentsSubscription2.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.hideOverlappingUIsSubscription) {
      this.hideOverlappingUIsSubscription.unsubscribe();
    }
  }
}
