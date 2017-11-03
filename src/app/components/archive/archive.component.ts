import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ArchiveService } from '../../services/wordpress/archive.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import {Archive, SearchParams} from '../../interfaces/archive';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import format from 'date-fns/format/index';
import {CookieService} from 'ngx-cookie';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, OnDestroy {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;
  @ViewChild('filters') filters: ElementRef;
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

  constructor(private archiveService: ArchiveService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private renderer: Renderer2,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private _cookieService: CookieService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    this.searchTerm = '';
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.hrefToSlugPipeFilter = new HrefToSlugPipe();
    this.documentResults = [];
    this.searchResults = [];
    this.latestDocuments = [];
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
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }


  showDocumentInPopup(item): void {
    this.popupWindowCommunicationService.showArchiveInPopup(item);
  }

  filterTopic(event, categoryID): void {
    event.stopPropagation();
    console.log("filterTopic");
    this.hideAllDropdown();
    this.categoryID = categoryID;
    this.searchDocuments();
    this.showResults = true;
  }

  filterDate(): void {
    console.log("filterDate");
    this.searchDocuments();
    this.showResults = true;
  }

  toggleDropdown(param, event): void {
    event.stopPropagation();
    if (this.displayedDropdown) {
      console.log("event");
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
      console.log("s");
    }
    this.displayedDropdown = false;
  }

  hideDropdowns(event) {
    console.log(event.target);
    console.log(this.displayedDropdownID);
    console.log(this.dropdowns[this.displayedDropdownID - 1]);
    console.log(this.displayedDropdown);
    //console.log(this.dropdowns[this.displayedDropdownID - 1].contains(event.target));

    if (this.dropdowns[this.displayedDropdownID - 1]) {
      if (!this.dropdowns[this.displayedDropdownID - 1].contains(event.target) && this.displayedDropdown) {
        console.log("pass");
        this.hideAllDropdown();
      }
    }
  }

  goToPage(slug): void {
    slug = this.hrefToSlugPipeFilter.transform(slug);
    this.router.navigate([slug]);
  }

  submitSearch(): void {
    this.showResultsDropdown = false;
    this.showResults = true;
    this.showFilters = true;
    this.documentResults = this.searchResults;
    //this.search();
  }

  liveSearch(event): void {
    if (event.keyCode !== 13) {
      this.documentsLoading = true;
      this.showResultsDropdown = true;
      this.showFilters = false;
      this.showResults = false;
      this.search();
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
    const searchParams: SearchParams = {
      searchTerm: this.searchTerm,
      categoryID: this.categoryID,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.documentsSubscription = this.archiveService.searchDocuments(searchParams, this.lang).subscribe(
        (res) => {
          this.documentsLoading = false;
          console.log(res);
          this.searchResults = res;
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  selectTerm(term): void {
    this.searchTerm = term;
    this.search();
    this.showResultsDropdown = true;
    this.showFilters = false;
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

  downloadFile(url: string) {
    window.open(url);
  }

  ngOnInit() {
    if (!this.pageNotFound) {
      this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.searchTerm = params['q'];
        if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
          console.log('pass');
          this.submitSearch();
        }
      });
      const self = this;
      const timer = setInterval(function () {
        console.log('timer');
        if (self.filters) {
          console.log('ptimer');
          clearInterval(timer);
          self.dropdowns = self.filters.nativeElement.getElementsByClassName('dropdown-container');
        }
      }, 100);

      const timer2 = setInterval(function () {
        console.log('timer2');
        if (self.searchField) {
          console.log('ptimer2');
          clearInterval(timer2);
          self.renderer.listen(self.searchField.nativeElement, 'search', () => {
            console.log(self.searchTerm);
            if (self.searchTerm === '') {
              console.log('search');
              if (self.lang === 'sv') {
                self.location.go('sv/archive?q=' + self.searchTerm);
              }else {
                self.location.go('en/archive?q=' + self.searchTerm);
              }
              self.showFilters = true;
              self.showResults = false;
              self.documentResults = self.latestDocuments;
            }
          });
        }
      }, 100);

      this.documentsSubscription2 = this.archiveService.getDocuments(10, this.lang).subscribe(
          (res) => {
            this.documentsLoading = false;
            console.log(res);
            this.documentResults = res;
            this.latestDocuments = res;
          },
          (error) => {
            console.log(error);
            this.notificationBarCommunicationService.send_data(error);
          });

      this.end_date = format(new Date(), 'YYYY-MM-DD');
      console.log(this.end_date);
    }

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
  }
}
