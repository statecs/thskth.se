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
  public party_associations: Association[];
  public spex_associations: Association[];
  public other_associations: Association[];
  public associationResults: any;
  public chapterResults: any;
  public otherResults: any;
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
    this.party_associations = [];
    this.spex_associations = [];
    this.other_associations = [];
    this.showAssociations = true;
    this.showChapters = false;
    this.showOthers = false;
    this.noResults = false;
    this.pageNotFound = false;
    this.showingPopup = false;
    this.associations = [
      {
        category: {
          en: "Career",
          sv: "Karriär"
        },
        associations: this.career_associations
      },
      {
        category: {
          en: "Party/events",
          sv: "Fest/event"
        },
        associations: this.party_associations
      },
      {
        category: {
          en: "Spex",
          sv: "Spex"
        },
        associations: this.spex_associations
      },
      {
        category: {
          en: "Sports",
          sv: "Idrott"
        },
        associations: this.sport_associations
      },
      {
        category: {
          en: "Social",
          sv: "Socialt"
        },
        associations: this.social_associations
      },

      {
        category: {
          en: "Other",
          sv: "Annat"
        },
        associations: this.other_associations
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
          this.titleCommunicationService.setTitle("Föreningar och Sektioner");
        } else {
          this.titleCommunicationService.setTitle("Associations and Chapters");
        }
      }
    );
  }

  checkResults(): void {
    if (
      (this.associationResults && this.chapterResults && this.otherResults) ||
      (this.associationResults &&
        this.chapterResults &&
        this.otherResults === undefined)
    ) {
      this.noResults = false;
    } else {
      this.noResults = true;
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
      relatedAssociations = this.party_associations;
    } else if (
      item.category === this.associations[2].category.en ||
      item.category === this.associations[2].category.sv
    ) {
      relatedAssociations = this.spex_associations;
    } else if (
      item.category === this.associations[3].category.en ||
      item.category === this.associations[3].category.sv
    ) {
      relatedAssociations = this.sport_associations;
    } else if (
      item.category === this.associations[4].category.en ||
      item.category === this.associations[4].category.sv
    ) {
      relatedAssociations = this.social_associations;
    } else if (
      item.category === this.associations[5].category.en ||
      item.category === this.associations[5].category.sv
    ) {
      relatedAssociations = this.other_associations;
    }
    this.popupWindowCommunicationService.showAssociationInPopup({
      association: item,
      relatedAssociations: relatedAssociations
    });
    if (this.lang === "sv") {
      this.location.go("sv/list/" + item.slug);
    } else {
      this.location.go("en/list/" + item.slug);
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
        this.showOthers = false;
        this.getAssociations();
      }
    }
  }

  search(): void {
    if (this.searchTerm !== "" && typeof this.searchTerm !== "undefined") {
      this.searchAssociations();
      this.searchChapters();
      this.searchOthers();
      if (this.lang === "sv") {
        this.location.go("sv/list?q=" + this.searchTerm);
      } else {
        this.location.go("en/list?q=" + this.searchTerm);
      }
    } else {
      if (this.lang === "sv") {
        this.location.go("sv/list");
      } else {
        this.location.go("en/list");
      }
    }
  }

  searchAssociations(): void {
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.spex_associations = [];
    this.party_associations = [];
    this.other_associations = [];
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
    if (localStorage.getItem("getChapters_sv") && this.lang === "sv") {
      this.chapterResults = JSON.parse(localStorage.getItem("getChapters_sv"));
      this.checkResults();
    } else if (localStorage.getItem("getChapters_en") && this.lang === "en") {
      this.chapterResults = JSON.parse(localStorage.getItem("getChapters_en"));
      this.checkResults();
    } else {
      this.chaptersSubscription2 = this.chaptersService
        .getChapters(this.lang)
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByName);
            if (this.lang === "sv") {
              localStorage.setItem(
                "getChapters_sv",
                JSON.stringify(sortedArrays)
              );
            } else {
              localStorage.setItem(
                "getChapters_en",
                JSON.stringify(sortedArrays)
              );
            }
            this.chapterResults = sortedArrays;
            this.checkResults();
          },
          error => {
            this.documentsLoading = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  searchOthers(): void {
    this.otherResults = [];
    this.othersSubscription = this.othersService
      .searchOthers(this.searchTerm, this.lang)
      .subscribe(
        res => {
          this.otherResults = res;
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
    this.otherResults = [];
    this.documentsLoading = true;
    this.showOthers = true;

    if (localStorage.getItem("getOthers_sv") && this.lang === "sv") {
      this.otherResults = JSON.parse(localStorage.getItem("getOthers_sv"));
      this.checkResults();
    } else if (localStorage.getItem("getOthers_en") && this.lang === "en") {
      this.otherResults = JSON.parse(localStorage.getItem("getOthers_en"));
      this.checkResults();
    } else {
      this.othersSubscription2 = this.othersService
        .getOthers(this.lang)
        .subscribe(
          res => {
            if (res) {
              const mergedArrays = this.mergeArrays(res);
              const sortedArrays = mergedArrays.sort(this.sortArrayByName);

              this.otherResults = sortedArrays;

              if (this.lang === "sv") {
                localStorage.setItem(
                  "getOthers_sv",
                  JSON.stringify(sortedArrays)
                );
              } else {
                localStorage.setItem(
                  "getOthers_en",
                  JSON.stringify(sortedArrays)
                );
              }
              this.checkResults();
            }
          },
          error => {
            this.documentsLoading = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
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
    this.spex_associations = [];
    this.party_associations = [];
    this.other_associations = [];

    if (localStorage.getItem("getAssociations_sv") && this.lang === "sv") {
      this.associationResults = JSON.parse(
        localStorage.getItem("getAssociations_sv")
      );

      this.allocateAssociations(this.associationResults);
      this.checkResults();
    } else if (
      localStorage.getItem("getAssociations_en") &&
      this.lang === "en"
    ) {
      this.associationResults = JSON.parse(
        localStorage.getItem("getAssociations_en")
      );

      this.allocateAssociations(this.associationResults);
      this.checkResults();
    } else {
      this.associationsSubsciption2 = this.associationsService
        .getAssociations(this.lang)
        .subscribe(
          res => {
            const mergedArrays = this.mergeArrays(res);
            const sortedArrays = mergedArrays.sort(this.sortArrayByName);
            this.associationResults = sortedArrays;
            if (this.lang === "sv") {
              localStorage.setItem(
                "getAssociations_sv",
                JSON.stringify(sortedArrays)
              );
            } else {
              localStorage.setItem(
                "getAssociations_en",
                JSON.stringify(sortedArrays)
              );
            }
            this.allocateAssociations(sortedArrays);
            this.otherResults = [];
            this.chapterResults = [];
            this.checkResults();
          },
          error => {
            this.noResults = true;
            this.documentsLoading = false;
            this.notificationBarCommunicationService.send_data(error);
          }
        );
    }
  }

  allocateAssociations(data): void {
    this.career_associations = [];
    this.sport_associations = [];
    this.social_associations = [];
    this.party_associations = [];
    this.spex_associations = [];
    this.other_associations = [];
    this.associations[0].associations = [];
    this.associations[1].associations = [];
    this.associations[2].associations = [];
    this.associations[3].associations = [];
    this.associations[4].associations = [];
    this.associations[5].associations = [];
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
        this.party_associations.push(a);
        this.associations[1].associations = this.party_associations;
      } else if (
        a.category === this.associations[2].category.en ||
        a.category === this.associations[2].category.sv
      ) {
        this.spex_associations.push(a);
        this.associations[2].associations = this.spex_associations;
      } else if (
        a.category === this.associations[3].category.en ||
        a.category === this.associations[3].category.sv
      ) {
        this.sport_associations.push(a);
        this.associations[3].associations = this.sport_associations;
      } else if (
        a.category === this.associations[4].category.en ||
        a.category === this.associations[4].category.sv
      ) {
        this.social_associations.push(a);
        this.associations[4].associations = this.social_associations;
      } else {
        this.other_associations.push(a);
        this.associations[5].associations = this.other_associations;
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
                    this.othersSubscription3 = this.othersService
                      .getOtherBySlug(this.slug, this.lang)
                      .subscribe(
                        res3 => {
                          if (res3.length > 0) {
                            this.showAssociationInPopup(res3[0]);
                            this.item_exist = true;
                            this.showingPopup = true;
                          } else {
                            this.pageNotFound = true;
                            this.item_exist = false;
                          }
                        },
                        error => {
                          this.notificationBarCommunicationService.send_data(
                            error
                          );
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
        },
        error => {
          this.documentsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  sortArrayByName(a, b) {
    a = a.title;
    b = b.title;
    return a < b ? -1 : a > b ? 1 : 0;
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach(event => {
      merged = merged.concat(event);
    });
    return merged;
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
              this.displayChapters();
              this.getChapters();
              const self = this;
              self.getPostBySlug();
            } else {
              this.getAssociations();
              const self = this;
              self.getPostBySlug();
            }
            /*  const self = this;
            const timer = setInterval(function() {
              if (
                self.career_associations.length > 0 ||
                self.chapterResults.length > 0
              ) {
                clearInterval(timer);
                //self.getPostBySlug();
              }
            }, 100);*/
          } else {
            if (this.cookieService.get("selectedFilter") === "chapters") {
              this.displayChapters();
              this.getChapters();
            } else {
              this.getAssociations();
            }
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
                this.router.navigate(["sv/list/" + this.slug]);
              } else {
                this.router.navigate(["en/list/" + this.slug]);
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
                self.router.navigate(["sv/list"]);
              } else {
                self.router.navigate(["en/list"]);
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
