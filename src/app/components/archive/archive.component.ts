import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ArchiveService } from '../../services/wordpress/archive.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import { Archive } from '../../interfaces/archive';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

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
  public date_filter: string;

  constructor(private archiveService: ArchiveService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private renderer: Renderer2) {
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    this.searchTerm = '';
    this.mostSearchTerms = ['Membership', 'THS card', 'Career', 'Student', 'Contact', 'News'];
    this.hrefToSlugPipeFilter = new HrefToSlugPipe();
    this.documentResults = [];
    this.showResultsDropdown = false;
    this.documentsLoading = true;
    this.showResults = false;
    this.displayedDropdown = false;
    this.content_typeIsDisabled = false;
    this.showFilters = true;
    this.docChecked = false;
    this.zipChecked = false;
    this.pdfChecked = false;
    this.categoryID = 0;
    this.date_filter = '2014-09-24';
  }

  filterTopic(event, categoryID): void {
    event.stopPropagation();
    console.log("filterTopic");
    this.hideAllDropdown();
    this.categoryID = categoryID;
    this.searchDocuments();
  }

  filterDate(): void {
    console.log("filterDate");
    this.searchDocuments();
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
    this.search();
  }

  liveSearch(event): void {
    if (event.keyCode !== 13) {
      this.documentResults = [];
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
    this.location.go('/archive?q=' + this.searchTerm);
  }

  searchDocuments(): void {
    this.archiveService.searchDocuments(this.searchTerm, this.categoryID, this.date_filter).subscribe((res) => {
      this.documentsLoading = false;
      console.log(res);
      this.documentResults = res;
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
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['q'];
      if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
        console.log('pass');
        this.submitSearch();
      }
    });

    this.dropdowns = this.filters.nativeElement.getElementsByClassName('dropdown-container');

    this.renderer.listen(this.searchField.nativeElement, 'search', () => {
      console.log(this.searchTerm);
      if (this.searchTerm === '') {
        console.log('search');
        this.location.go('/archive');
        this.showFilters = true;
      }
    });
  }

}
