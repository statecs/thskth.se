import {Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import { ChaptersAssociationsService } from '../../services/wordpress/chapters-associations.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HrefToSlugPipe } from '../../pipes/href-to-slug.pipe';
import { Location } from '@angular/common';
import { Archive } from '../../interfaces/archive';
import {Association, Chapter} from '../../interfaces/chapters_associations';
import {forEach} from "@angular/router/src/utils/collection";
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';

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

  constructor(private chaptersAssociationsService: ChaptersAssociationsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private popupWindowCommunicationService: PopupWindowCommunicationService,
              private renderer: Renderer2) {
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
    this.associations = [
      {
        category: 'Career and consulting',
        associations: this.career_associations
      },
      {
        category: 'Sports associations',
        associations: this.sport_associations
      },
      {
        category: 'Social activities',
        associations: this.social_associations
      },
    ];
  }

  checkResults(): void {
    if (this.associationResults.length === 0 && this.chapterResults.length === 0) {
      this.noResults = true;
    }else {
      this.noResults = false;
    }
  }

  showAssociationInPopup(item: Association): void {
    let relatedAssociations: Association[] = [];
    if (item.category === 'Career and consulting') {
      relatedAssociations = this.career_associations;
    }else if (item.category === 'Sports associations') {
      relatedAssociations = this.sport_associations;
    }else if (item.category === 'Social activities') {
      relatedAssociations = this.social_associations;
    }
    this.popupWindowCommunicationService.showAssociationInPopup({association: item, relatedAssociations: relatedAssociations});
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
      this.location.go('/associations-and-chapters?q=' + this.searchTerm);
    }
  }

    searchAssociations(): void {
        this.career_associations = [];
        this.sport_associations = [];
        this.social_associations = [];
        this.chaptersAssociationsService.searchAssociations(this.searchTerm).subscribe((res) => {
            this.documentsLoading = false;
            console.log(res);
            this.associationResults = res;
            this.allocateAssociations(res);
            this.showAssociations = true;
            this.checkResults();
        });
    }

    searchChapters(): void {
      this.chapterResults = [];
        this.chaptersAssociationsService.searchChapters(this.searchTerm).subscribe((res) => {
            this.documentsLoading = false;
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
    this.chaptersAssociationsService.getChapters().subscribe((res) => {
      this.documentsLoading = false;
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
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.chaptersAssociationsService.getAssociations().subscribe((res) => {
      this.documentsLoading = false;
      console.log(res);
      this.associationResults = res;
      this.allocateAssociations(res);
      this.checkResults();
    });
  }

  allocateAssociations(data): void {
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.associations[0].associations = [];
    this.associations[1].associations = [];
    this.associations[2].associations = [];
    data.forEach(a => {
      if (a.category === 'Career and consulting') {
        this.career_associations.push(a);
        this.associations[0].associations = this.career_associations;
      }else if (a.category === 'Sports associations') {
        this.sport_associations.push(a);
        this.associations[1].associations = this.sport_associations;
      }else if (a.category === 'Social activities') {
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

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['q'];
      console.log(this.searchTerm);
      if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
        console.log('pass');
        this.submitSearch();
      }
      if (this.searchTerm === 'undefined' || typeof this.searchTerm === 'undefined') {
        console.log('pass');
        this.getAssociations();
      }
    });

    this.renderer.listen(this.searchField.nativeElement, 'search', () => {
      console.log(this.searchTerm);
      if (this.searchTerm === '') {
        console.log('search');
        this.location.go('/associations-and-chapters');
        this.showChapters = false;
        this.showAssociations = true;
        this.getAssociations();
      }
    });
  }

}
