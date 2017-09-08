import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SearchService } from '../../services/wordpress/search.service';
import { SearchResult } from '../../interfaces/search';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import {Location} from '@angular/common';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;

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
  public showResultsDropdown: boolean;
  public postsLoading: boolean;
  public pagesLoading: boolean;
  public faqsLoading: boolean;
  public showResults: boolean;

  constructor(private searchService: SearchService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location ) {
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
  }

  goToPage(slug): void {
    slug = this.hrefToSlugPipeFilter.transform(slug);
    this.router.navigate([slug]);
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
    this.location.go('/archive?q=' + this.searchTerm);
  }

  searchPosts(): void {
    this.searchService.searchPosts(this.searchTerm, 4).subscribe((res) => {
      this.postsLoading = false;
      this.postsResults = res;
    });
  }

  searchPages(): void {
    this.searchService.searchPages(this.searchTerm, 4).subscribe((res) => {
      this.pagesLoading = false;
      this.pageResults = res;
    });
  }

  searchFAQs(): void {
    this.searchService.searchFAQs(this.searchTerm, 4).subscribe((res) => {
      this.faqsLoading = false;
      this.faqResults = res;
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
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['q'];
      this.submitSearch();
    });
  }

}
