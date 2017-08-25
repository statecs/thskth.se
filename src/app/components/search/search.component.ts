import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;

  public postsChecked: boolean;
  public pageChecked: boolean;
  public faqChecked: boolean;
  public showFilterOptions: boolean;
  public searchOnFocus: boolean;
  public searchTerm: string;
  public mostSearchTerms: string[];

  constructor() {
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    this.searchTerm = '';
    this.mostSearchTerms = ['Term1', 'Term2', 'Term3', 'Term4', 'Term5', 'Term6'];
  }

  selectTerm(term): void {
    this.searchTerm = term;
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
  }

  ngOnInit() {
  }

}
