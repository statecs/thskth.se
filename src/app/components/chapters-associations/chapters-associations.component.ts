import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ChaptersAssociationsService } from '../../services/wordpress/chapters-associations.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import { Archive } from '../../interfaces/archive';
import {Association, Chapter} from '../../interfaces/chapters_associations';

@Component({
  selector: 'app-chapters-associations',
  templateUrl: './chapters-associations.component.html',
  styleUrls: ['./chapters-associations.component.scss']
})
export class ChaptersAssociationsComponent implements OnInit {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;

  public postsChecked: boolean;
  public pageChecked: boolean;
  public faqChecked: boolean;
  public showFilterOptions: boolean;
  public searchOnFocus: boolean;
  public searchTerm: string;
  public mostSearchTerms: string[];
  public associationResults: Association[];
  public chapterResults: Chapter[];
  private hrefToSlugPipeFilter: HrefToSlugPipe;
  public showResultsDropdown: boolean;
  public documentsLoading: boolean;
  public showResults: boolean;

  public layout_grid: boolean;
  public layout_list: boolean;

  constructor(private chaptersAssociationsService: ChaptersAssociationsService,
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
    this.associationResults = [];
    this.chapterResults = [];
    this.showResultsDropdown = false;
    this.documentsLoading = true;
    this.showResults = false;
    this.layout_grid = true;
    this.layout_list = false;
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
      this.associationResults = [];
      this.documentsLoading = true;
      this.showResultsDropdown = true;
      this.showResults = false;
      this.search();
    }
  }

  search(): void {
    if (this.postsChecked) {
      this.getAssociations();
    }
    this.location.go('/associations-and-chapters?q=' + this.searchTerm);
  }

  getAssociations(): void {
    this.chaptersAssociationsService.getAssociations().subscribe((res) => {
      this.documentsLoading = false;
      console.log(res);
      this.associationResults = res;
    });
  }

  getChapters(): void {
    this.chaptersAssociationsService.getChapters().subscribe((res) => {
      this.documentsLoading = false;
      console.log(res);
      this.chapterResults = res;
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

  downloadFile(url: string) {
    window.open(url);
  }

  switchLayout(layout) {
    if (layout === 'grid') {
      this.layout_grid = true;
      this.layout_list = false;
    }else if (layout === 'list') {
      this.layout_list = true;
      this.layout_grid = false;
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['q'];
      this.submitSearch();
    });

    this.getAssociations();
  }

}
