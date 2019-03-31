import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HrefToSlugPipe } from "../../pipes/href-to-slug.pipe";
import {
  Association,
  Chapter,
  Other
} from "../../interfaces-and-classes/chapters_associations";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { CookieService } from "ngx-cookie";
import { Location } from "@angular/common";
import { ChaptersService } from "../../services/wordpress/chapters.service";
import { OthersService } from "../../services/wordpress/others.service";
import { AssociationsService } from "../../services/wordpress/associations.service";

@Component({
  selector: "app-chapters-associations",
  templateUrl: "./chapters-associations.component.html",
  styleUrls: ["./chapters-associations.component.scss"]
})
export class ChaptersAssociationsComponent implements OnInit, OnDestroy {
  @ViewChild("searchForm") searchForm: ElementRef;
  @ViewChild("filter_icon") filter_icon: ElementRef;
  @ViewChild("searchField") searchField: ElementRef;

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
  public otherResults: Other[];
  private hrefToSlugPipeFilter: HrefToSlugPipe;
  public showResultsDropdown: boolean;
  public documentsLoading: boolean;
  public showResults: boolean;

  public layout_grid: boolean;
  public layout_list: boolean;
  public showAssociations: boolean;
  public showChapters: boolean;
  public showOthers: boolean;
  public noResults: boolean;
  public slug: string;
  public pageNotFound: boolean;
  private lang: string;
  public item_exist: boolean;
  public paramsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public queryParamsSubscription: Subscription;
  public associationsSubsciption: Subscription;
  public associationsSubsciption2: Subscription;
  public associationsSubsciption3: Subscription;
  public chaptersSubscription: Subscription;
  public chaptersSubscription2: Subscription;
  public chaptersSubscription3: Subscription;
  public othersSubscription: Subscription;
  public othersSubscription2: Subscription;
  public othersSubscription3: Subscription;
  public showingPopup: boolean;

  constructor(
    private chaptersService: ChaptersService,
    private associationsService: AssociationsService,
    private othersService: OthersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private renderer: Renderer2,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService,
    private cookieService: CookieService
  ) {
    this.item_exist = false;
    this.postsChecked = true;
    this.pageChecked = true;
    this.faqChecked = true;
    this.showFilterOptions = false;
    this.searchOnFocus = false;
    this.searchTerm = "";
    this.mostSearchTerms = [
      "Membership",
      "THS card",
      "Career",
      "Student",
      "Contact",
      "News"
    ];
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
    this.showOthers = false;
    this.noResults = false;
    this.pageNotFound = false;
    this.showingPopup = false;
    this.associations = [
      {
        category: {
          en: "Career and consulting",
          sv: "Karriär och rådgivning"
        },
        associations: this.career_associations
      },
      {
        category: {
          en: "Sports associations",
          sv: "Idrottsföreningar"
        },
        associations: this.sport_associations
      },
      {
        category: {
          en: "Social activities",
          sv: "Sociala aktiviteter"
        },
        associations: this.social_associations
      }
    ];
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.pageNotFound = true;
          this.item_exist = false;
          this.lang = "en";
        }
        if (this.lang === "sv") {
          this.titleCommunicationService.setTitle("Föreningar och sektioner");
        } else {
          this.titleCommunicationService.setTitle("Associations and chapters");
        }
      }
    );
  }

  checkResults(): void {
    if (
      this.associationResults.length === 0 &&
      this.chapterResults.length === 0 &&
      this.otherResults.length === 0
    ) {
      this.noResults = true;
    } else {
      this.noResults = false;
    }
    this.documentsLoading = false;
  }

  showAssociationInPopup(item: any): void {
    let relatedAssociations: Association[] = [];
    if (
      item.category === this.associations[0].category.en ||
      item.category === this.associations[0].category.sv
    ) {
      relatedAssociations = this.career_associations;
    } else if (
      item.category === this.associations[1].category.en ||
      item.category === this.associations[1].category.sv
    ) {
      relatedAssociations = this.sport_associations;
    } else if (
      item.category === this.associations[2].category.en ||
      item.category === this.associations[2].category.sv
    ) {
      relatedAssociations = this.social_associations;
    }
    this.popupWindowCommunicationService.showAssociationInPopup({
      association: item,
      relatedAssociations: relatedAssociations
    });
    if (this.lang === "sv") {
      this.location.go("sv/associations-and-chapters/" + item.slug);
    } else {
      this.location.go("en/associations-and-chapters/" + item.slug);
    }
  }

  goToPage(slug): void {
    slug = this.hrefToSlugPipeFilter.transform(slug);
    this.router.navigate([slug]);
  }

  submitSearch(): void {
    if (this.searchTerm !== "" && typeof this.searchTerm !== "undefined") {
      this.showResultsDropdown = false;
      this.showResults = true;
      this.search();
    }
  }

  liveSearch(event): void {
    if (event.keyCode !== 13) {
      if (this.searchTerm !== "" && typeof this.searchTerm !== "undefined") {
        this.documentsLoading = true;
        this.showResultsDropdown = true;
        this.showResults = false;
        this.search();
      } else {
        this.showAssociations = true;
        this.showChapters = false;
        this.getAssociations();
      }
    }
  }

  search(): void {
    if (this.searchTerm !== "" && typeof this.searchTerm !== "undefined") {
      this.searchAssociations();
      this.searchChapters();
      if (this.lang === "sv") {
        this.router.navigate(["sv/associations-and-chapters"], {
          queryParams: { q: this.searchTerm }
        });
      } else {
        this.router.navigate(["en/associations-and-chapters"], {
          queryParams: { q: this.searchTerm }
        });
      }
    }
  }

  searchAssociations(): void {
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.associationsSubsciption = this.associationsService
      .searchAssociations(this.searchTerm, this.lang)
      .subscribe(
        res => {
          this.associationResults = res;
          this.allocateAssociations(res);
          this.showAssociations = true;
          this.checkResults();
        },
        error => {
          this.showAssociations = false;
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  searchChapters(): void {
    this.chapterResults = [];
    this.chaptersSubscription = this.chaptersService
      .searchChapters(this.searchTerm, this.lang)
      .subscribe(
        res => {
          this.chapterResults = res;
          this.showChapters = true;
          this.checkResults();
        },
        error => {
          this.showChapters = false;
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  displayChapters(): void {
    this.showAssociations = false;
    this.showChapters = true;
    this.showOthers = false;
    this.cookieService.put("selectedFilter", "chapters");
    if (
      (this.searchTerm !== "" && this.searchTerm === "undefined") ||
      typeof this.searchTerm === "undefined"
    ) {
      this.getChapters();
    }
  }

  getChapters(): void {
    this.documentsLoading = true;
    this.showChapters = true;
    this.chaptersSubscription2 = this.chaptersService
      .getChapters(this.lang)
      .subscribe(
        res => {
          this.chapterResults = res;
          this.checkResults();
        },
        error => {
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  searchOthers(): void {
    this.otherResults = [];
    this.othersSubscription = this.othersService
      .searchOthers(this.searchTerm, this.lang)
      .subscribe(
        res => {
          this.chapterResults = res;
          this.showOthers = true;
          this.checkResults();
        },
        error => {
          this.showOthers = false;
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  displayOthers(): void {
    this.showAssociations = false;
    this.showChapters = false;
    this.showOthers = true;
    this.cookieService.put("selectedFilter", "others");
    if (
      (this.searchTerm !== "" && this.searchTerm === "undefined") ||
      typeof this.searchTerm === "undefined"
    ) {
      this.getOthers();
    }
  }

  getOthers(): void {
    this.documentsLoading = true;
    this.showOthers = true;
    this.othersSubscription2 = this.othersService
      .getOthers(this.lang)
      .subscribe(
        res => {
          this.otherResults = res;
          this.checkResults();
        },
        error => {
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  displayAssociations(): void {
    this.showAssociations = true;
    this.showChapters = false;
    this.showOthers = false;
    this.cookieService.put("selectedFilter", "associations");
    if (
      (this.searchTerm !== "" && this.searchTerm === "undefined") ||
      typeof this.searchTerm === "undefined"
    ) {
      this.getAssociations();
    }
  }

  getAssociations(): void {
    this.documentsLoading = true;
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.associationsSubsciption2 = this.associationsService
      .getAssociations(this.lang)
      .subscribe(
        res => {
          this.associationResults = res;
          this.allocateAssociations(res);
          this.checkResults();
        },
        error => {
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  allocateAssociations(data): void {
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.associations[0].associations = [];
    this.associations[1].associations = [];
    this.associations[2].associations = [];
    data.forEach(a => {
      if (
        a.category === this.associations[0].category.en ||
        a.category === this.associations[0].category.sv
      ) {
        this.career_associations.push(a);
        this.associations[0].associations = this.career_associations;
      } else if (
        a.category === this.associations[1].category.en ||
        a.category === this.associations[1].category.sv
      ) {
        this.sport_associations.push(a);
        this.associations[1].associations = this.sport_associations;
      } else if (
        a.category === this.associations[2].category.en ||
        a.category === this.associations[2].category.sv
      ) {
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
    this.searchOnFocus
      ? (this.searchOnFocus = false)
      : (this.searchOnFocus = true);
  }

  switchLayout(layout) {
    if (layout === "grid") {
      this.layout_grid = true;
      this.layout_list = false;
    } else if (layout === "list") {
      this.layout_list = true;
      this.layout_grid = false;
    }
  }

  getPostBySlug() {
    this.associationsSubsciption3 = this.associationsService
      .getAssociationBySlug(this.slug, this.lang)
      .subscribe(
        res => {
          if (res.length > 0) {
            this.showAssociationInPopup(res[0]);
            this.showingPopup = true;
            this.item_exist = true;
          } else {
            this.chaptersSubscription3 = this.chaptersService
              .getChapterBySlug(this.slug, this.lang)
              .subscribe(
                res2 => {
                  if (res2.length > 0) {
                    this.showAssociationInPopup(res2[0]);
                    this.item_exist = true;
                    this.showingPopup = true;
                  } else {
                    this.pageNotFound = true;
                    this.item_exist = false;
                  }
                },
                error => {
                  this.documentsLoading = false;
                  this.notificationBarCommunicationService.send_data(error);
                }
              );
          }
        },
        error => {
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    if (!this.pageNotFound) {
      this.paramsSubscription2 = this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.pageNotFound = false;
          this.slug = params["slug"];
          this.popupWindowCommunicationService.showLoader();
          if (this.slug !== "undefined" && typeof this.slug !== "undefined") {
            if (this.cookieService.get("selectedFilter") === "chapters") {
              this.getChapters();
            } else {
              this.getAssociations();
            }
            const self = this;
            const timer = setInterval(function() {
              if (
                self.career_associations.length > 0 ||
                self.chapterResults.length > 0
              ) {
                clearInterval(timer);
                self.getPostBySlug();
              }
            }, 100);
            //this.getPostBySlug();
          }
        }
      );

      this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(
        (params: Params) => {
          if (this.slug === "undefined" || typeof this.slug === "undefined") {
            this.item_exist = true;
            this.searchTerm = params["q"];
            if (
              this.searchTerm !== "undefined" &&
              typeof this.searchTerm !== "undefined" &&
              this.searchTerm !== ""
            ) {
              this.submitSearch();
            } else {
              if (this.cookieService.get("selectedFilter") === "chapters") {
                this.displayChapters();
                this.getChapters();
              } else {
                if (this.associations[0].associations.length === 0) {
                  this.getAssociations();
                }
              }
            }
            const arg = {
              hidden: true,
              navigateBack: true
            };
            this.popupWindowCommunicationService.hidePopup(arg);
          } else {
            if (params["q"] && !this.pageNotFound) {
              if (this.lang === "sv") {
                this.router.navigate([
                  "sv/associations-and-chapters/" + this.slug
                ]);
              } else {
                this.router.navigate([
                  "en/associations-and-chapters/" + this.slug
                ]);
              }
            }
          }
        }
      );

      const self = this;
      const timer = setInterval(function() {
        if (self.searchTerm) {
          clearInterval(timer);
          self.renderer.listen(self.searchField.nativeElement, "search", () => {
            if (self.searchTerm === "") {
              if (this.lang === "sv") {
                self.router.navigate(["sv/associations-and-chapters"]);
              } else {
                self.router.navigate(["en/associations-and-chapters"]);
              }
              self.showChapters = false;
              self.showAssociations = true;
              /*if (this.cookieService.get('selectedFilter') === 'chapters') {
                this.displayChapters();
                this.getChapters();
              }else {
                this.getAssociations();
              }*/
            }
          });
        }
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.associationsSubsciption) {
      this.associationsSubsciption.unsubscribe();
    }
    if (this.associationsSubsciption2) {
      this.associationsSubsciption2.unsubscribe();
    }
    if (this.associationsSubsciption3) {
      this.associationsSubsciption3.unsubscribe();
    }
    if (this.chaptersSubscription) {
      this.chaptersSubscription.unsubscribe();
    }
    if (this.chaptersSubscription2) {
      this.chaptersSubscription2.unsubscribe();
    }
    if (this.chaptersSubscription3) {
      this.chaptersSubscription3.unsubscribe();
    }
    if (this.othersSubscription) {
      this.othersSubscription.unsubscribe();
    }
    if (this.othersSubscription2) {
      this.othersSubscription2.unsubscribe();
    }
    if (this.othersSubscription3) {
      this.othersSubscription3.unsubscribe();
    }
  }
}
