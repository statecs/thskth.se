import {Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import { ChaptersAssociationsService } from '../../services/wordpress/chapters-associations.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import { Archive } from '../../interfaces/archive';
import {Association, Chapter} from '../../interfaces/chapters_associations';
import {forEach} from '@angular/router/src/utils/collection';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-chapters-associations',
  templateUrl: './chapters-associations.component.html',
  styleUrls: ['./chapters-associations.component.scss']
})
export class ChaptersAssociationsComponent implements OnInit {

  @ViewChild('searchForm') searchForm: ElementRef;
  @ViewChild('filter_icon') filter_icon: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;

  public postsChecked: boolean;
  public pageChecked: boolean;
  public faqChecked: boolean;
  public showFilterOptions: boolean;
  public searchOnFocus: boolean;
  public searchTerm: string;
  public mostSearchTerms: string[];
  public associations: any[];
  public career_associations: Association[];
  public sport_associations: Association[];
  public social_associations: Association[];
  public associationResults: Association[];
  public chapterResults: Chapter[];
  private hrefToSlugPipeFilter: HrefToSlugPipe;
  public showResultsDropdown: boolean;
  public documentsLoading: boolean;
  public showResults: boolean;

  public layout_grid: boolean;
  public layout_list: boolean;
  public showAssociations: boolean;
  public showChapters: boolean;
  public noResults: boolean;
  public slug: string;
  public pageNotFound: boolean;
  private lang: string;

  constructor(private chaptersAssociationsService: ChaptersAssociationsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private renderer: Renderer2,
              private _cookieService: CookieService) {
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
    this.showResults = true;
    this.layout_grid = true;
    this.layout_list = false;
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.showAssociations = true;
    this.showChapters = false;
    this.noResults = false;
    this.pageNotFound = false;
    this.associations = [
      {
        category: {
          en: 'Career and consulting',
          sv: 'Karriär och rådgivning'
        },
        associations: this.career_associations
      },
      {
        category: {
          en: 'Sports associations',
          sv: 'Idrottsföreningar'
        },
        associations: this.sport_associations
      },
      {
        category: {
          en: 'Social activities',
          sv: 'Sociala aktiviteter'
        },
        associations: this.social_associations
      },
    ];
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      console.log(this.lang);
      if (this.lang === 'en') {
        this.router.navigate(['associations-and-chapters']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  checkResults(): void {
    if (this.associationResults.length === 0 && this.chapterResults.length === 0) {
      this.noResults = true;
    }else {
      this.noResults = false;
    }
    this.documentsLoading = false;
  }

  showAssociationInPopup(item: any): void {
    console.log('show');
    let relatedAssociations: Association[] = [];
    if (item.category === this.associations[0].category.en || item.category === this.associations[0].category.sv) {
      relatedAssociations = this.career_associations;
    }else if (item.category === this.associations[1].category.en || item.category === this.associations[1].category.sv) {
      relatedAssociations = this.sport_associations;
    }else if (item.category === this.associations[2].category.en || item.category === this.associations[2].category.sv) {
      relatedAssociations = this.social_associations;
    }
    this.popupWindowCommunicationService.showAssociationInPopup({association: item, relatedAssociations: relatedAssociations});
    this.router.navigate(['/associations-and-chapters/' + item.slug]);
  }

  goToPage(slug): void {
    slug = this.hrefToSlugPipeFilter.transform(slug);
    this.router.navigate([slug]);
  }

  submitSearch(): void {
    console.log(this.searchTerm);
    if (this.searchTerm !== '' && typeof this.searchTerm !== 'undefined') {
      console.log("pass");
      this.showResultsDropdown = false;
      this.showResults = true;
      this.search();
    }
  }

  liveSearch(event): void {
      console.log(this.searchTerm);
    if (event.keyCode !== 13) {
      if (this.searchTerm !== '' && typeof this.searchTerm !== 'undefined') {
        this.documentsLoading = true;
        this.showResultsDropdown = true;
        this.showResults = false;
        this.search();
      }else {
        this.showAssociations = true;
        this.showChapters = false;
        this.getAssociations();
      }
    }
  }

  search(): void {
    if (this.searchTerm !== '' && typeof this.searchTerm !== 'undefined') {
      this.searchAssociations();
      this.searchChapters();
      if (this.lang === 'sv') {
        this.router.navigate(['sv/associations-and-chapters'], {queryParams: { 'q': this.searchTerm }});
      }else {
        this.router.navigate(['/associations-and-chapters'], {queryParams: { 'q': this.searchTerm }});
      }

    }
  }

    searchAssociations(): void {
        this.career_associations = [];
        this.sport_associations = [];
        this.social_associations = [];
        this.chaptersAssociationsService.searchAssociations(this.searchTerm, this.lang).subscribe((res) => {
            console.log(res);
            this.associationResults = res;
            this.allocateAssociations(res);
            this.showAssociations = true;
            this.checkResults();
        });
    }

    searchChapters(): void {
      this.chapterResults = [];
        this.chaptersAssociationsService.searchChapters(this.searchTerm, this.lang).subscribe((res) => {
            console.log(res);
            this.chapterResults = res;
            this.showChapters = true;
            this.checkResults();
        });
    }

  displayChapters(): void {
    this.showAssociations = false;
    this.showChapters = true;
    if (this.searchTerm !== '' && this.searchTerm === 'undefined' || typeof this.searchTerm === 'undefined') {
      this.getChapters();
    }
  }

  getChapters(): void {
    this.documentsLoading = true;
    this.chaptersAssociationsService.getChapters(this.lang).subscribe((res) => {
      console.log(res);
      this.chapterResults = res;
      this.checkResults();
    });
  }

  displayAssociations(): void {
    this.showAssociations = true;
    this.showChapters = false;
    if (this.searchTerm !== '' && this.searchTerm === 'undefined' || typeof this.searchTerm === 'undefined') {
      this.getAssociations();
    }
  }

  getAssociations(): void {
    this.documentsLoading = true;
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.chaptersAssociationsService.getAssociations(this.lang).subscribe((res) => {
      this.associationResults = res;
      console.log(res);
      this.allocateAssociations(res);
      this.checkResults();
    });
  }

  allocateAssociations(data): void {
    console.log('allocateAssociations');
    console.log(data);
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.associations[0].associations = [];
    this.associations[1].associations = [];
    this.associations[2].associations = [];
    data.forEach(a => {
      if (a.category === this.associations[0].category.en || a.category === this.associations[0].category.sv) {
        this.career_associations.push(a);
        this.associations[0].associations = this.career_associations;
      }else if (a.category === this.associations[1].category.en || a.category === this.associations[1].category.sv) {
        this.sport_associations.push(a);
        this.associations[1].associations = this.sport_associations;
      }else if (a.category === this.associations[2].category.en || a.category === this.associations[2].category.sv) {
        this.social_associations.push(a);
        this.associations[2].associations = this.social_associations;
      }
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

  switchLayout(layout) {
    if (layout === 'grid') {
      this.layout_grid = true;
      this.layout_list = false;
    }else if (layout === 'list') {
      this.layout_list = true;
      this.layout_grid = false;
    }
  }

  getPostBySlug() {
    this.chaptersAssociationsService.getAssociationBySlug(this.slug, this.lang).subscribe((res) => {
      if (res.length > 0) {
        this.showAssociationInPopup(res[0]);
      }else {
        this.chaptersAssociationsService.getChapterBySlug(this.slug, this.lang).subscribe((res2) => {
          if (res2.length > 0) {
            this.showAssociationInPopup(res2[0]);
          }else {
            this.pageNotFound = true;
          }
        });
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      this.popupWindowCommunicationService.showLoader();
      if (this.slug !== 'undefined' && typeof this.slug !== 'undefined') {
        this.getAssociations();
        const self = this;
        const timer = setInterval(function () {
          if (self.career_associations.length > 0) {
            clearInterval(timer);
            self.getPostBySlug();
          }
        }, 100);
      }
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (this.slug === 'undefined' || typeof this.slug === 'undefined') {
        this.searchTerm = params['q'];
        if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
            this.submitSearch();
        }
        if (this.searchTerm === 'undefined' || typeof this.searchTerm === 'undefined') {
          if (this.associations[0].associations.length === 0) {
            this.getAssociations();
          }
        }
        this.popupWindowCommunicationService.hidePopup(true);
      }else {
        if (params['q']) {
          this.router.navigate(['/associations-and-chapters/' + this.slug]);
        }
      }
    });

    const self = this;
    const timer = setInterval(function () {
      if (self.searchTerm) {
        clearInterval(timer);
        self.renderer.listen(self.searchField.nativeElement, 'search', () => {
          if (self.searchTerm === '') {
            self.router.navigate(['/associations-and-chapters']);
            self.showChapters = false;
            self.showAssociations = true;
            self.getAssociations();
          }
        });
      }
    }, 100);
  }

}
