import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import { SearchService } from '../../services/wordpress/search.service';
import { SearchResult } from '../../interfaces/search';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-search-menubar',
  templateUrl: './search-menubar.component.html',
  styleUrls: ['./search-menubar.component.scss']
})
export class SearchMenubarComponent implements OnInit {
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

  constructor(private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private searchService: SearchService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.showSearchBar = false;
    this.showResultsDropdown = false;
    this.pageResults = [];
    this.postsResults = [];
    this.faqResults = [];
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      console.log(this.lang);
    });
  }

  goToSearchPage(): void {
    this.hideBar();
    this.router.navigate(['search'], { queryParams: { q: this.searchTerm } });
  }

  showBar(): void {
    this.showSearchBar = true;
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
    }else {
      this.showResultsDropdown = false;
    }
  }

  searchPosts(): void {
    this.searchService.searchPosts(this.searchTerm, 2, this.lang).subscribe((res) => {
      this.postsLoading = false;
      this.postsResults = res;
    });
  }

  searchPages(): void {
    this.searchService.searchPages(this.searchTerm, 2, this.lang).subscribe((res) => {
      this.pagesLoading = false;
      this.pageResults = res;
    });
  }

  searchFAQs(): void {
    this.searchService.searchFAQs(this.searchTerm, 2, this.lang).subscribe((res) => {
      this.faqsLoading = false;
      this.faqResults = res;
    });
  }

  ngOnInit() {
    this.searchMenubarCommunicationService.notifyObservable$.subscribe(() => {
      this.showBar();
    });
  }

}
