import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { FaqsService } from "../../services/wordpress/faqs.service";
import { FAQ, FAQCategory, FAQSubMenu } from "../../interfaces-and-classes/faq";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { PopupWindowCommunicationService } from "../../services/component-communicators/popup-window-communication.service";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../services/component-communicators/title-communication.service";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { SearchResult } from "../../interfaces-and-classes/search";
import { FaqCategoriesService } from "../../services/wordpress/faq-categories.service";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"]
})
export class SupportComponent implements OnInit, OnDestroy {
  @ViewChild("searchField") searchField: ElementRef;
  @ViewChild("selected_faq_el") selected_faq_el: ElementRef;
  public parent_categories: FAQCategory[];
  public selected_category: FAQCategory;
  public selected_cat_index: number;
  public faq_subMenus: FAQSubMenu[];
  public faqs: FAQ[];
  public search_results: SearchResult[];
  public showFaqs: boolean;
  public loading: boolean;
  public noResult: boolean;
  public searchTerm: string;
  public noInput: boolean;
  public searchOnActive: boolean;
  public selected_cat_slug: string;
  public most_asked_faqs: FAQ[];
  public show_single_view: boolean;
  private lang: string;
  public pageNotFound: boolean;
  private exist_category: boolean;
  public paramsSubscription: Subscription;
  public paramsSubscription2: Subscription;
  public paramsSubscription3: Subscription;
  public queryParamsSubscription: Subscription;
  public faq_slug: string;
  public selected_faq: FAQ;

  constructor(
    private faqsService: FaqsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private location: Location,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private titleCommunicationService: TitleCommunicationService,
    private headerCommunicationService: HeaderCommunicationService,
    private faqCategoriesService: FaqCategoriesService
  ) {
    this.exist_category = false;
    this.pageNotFound = false;
    this.selected_cat_index = 0;
    this.showFaqs = true;
    this.loading = true;
    this.faqs = [];
    this.faq_subMenus = [];
    this.noResult = false;
    this.search_results = [];
    this.searchTerm = "";
    this.noInput = false;
    this.parent_categories = [];
    this.most_asked_faqs = [];
    this.show_single_view = false;
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.pageNotFound = false;
        this.lang = params["lang"];
        this.faq_slug = params["slug"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang !== "en" && this.lang !== "sv") {
          this.pageNotFound = true;
          this.lang = "en";
        }
        if (this.lang === "sv") {
          this.titleCommunicationService.setTitle("Hjälp");
        } else {
          this.titleCommunicationService.setTitle("Help Center");
        }
      }
    );
  }

  showInPopup(faq: FAQ) {
    this.popupWindowCommunicationService.showFaqInPopup(faq);
  }

  onFocus(): void {
    this.noInput = false;
    this.noResult = false;
  }

  searchFAQs(): void {
    this.show_single_view = true;
    this.selected_faq = null;
    if (this.lang === "sv") {
      this.location.go("sv/help?q=" + this.searchTerm);
    } else {
      this.location.go("en/help?q=" + this.searchTerm);
    }

    if (this.searchTerm === "") {
      this.searchTerm = "";
      this.noInput = true;
      this.search_results = [];
    } else {
      this.searchOnActive = true;
      this.selected_cat_index = null;
      this.selected_category = null;
      this.loading = true;
      this.faqsService.searchFAQs(this.searchTerm, 100, this.lang).subscribe(
        faqs => {
          this.search_results = faqs;

          this.loading = false;
          if (faqs.length === 0 && this.faq_subMenus.length === 0) {
            this.noResult = true;
          }
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
    }
  }

  toggleAnswer(faq: any): void {
    const el_answer = faq.lastChild.previousSibling;
    const el_toggleBtn = faq.firstChild.nextSibling;
    if (el_answer.getAttribute("data-collapsed") === "true") {
      el_toggleBtn.innerHTML = "-";
      this.expandElement(el_answer);
    } else {
      el_toggleBtn.innerHTML = "+";
      this.collapseElement(el_answer);
    }
  }

  expandElement(element) {
    element.style.display = "block";
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = element.scrollHeight;
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + "px";
    element.setAttribute("data-collapsed", "false");
  }

  collapseElement(element) {
    element.style.height = "0";
    element.setAttribute("data-collapsed", "true");
    setTimeout(function() {
      element.style.display = "none";
    }, 500);
  }

  displayCategory(index): void {
    this.searchTerm = undefined;
    this.selected_cat_index = index;
    this.selected_category = this.parent_categories[index];
    if (this.lang === "sv") {
      this.router.navigate(["sv/help/" + this.parent_categories[index].slug]);
    } else {
      this.router.navigate(["en/help/" + this.parent_categories[index].slug]);
    }
  }

  getFAQs_ByCategoryID(catID): void {
    this.faqsService.getFAQs_ByCategoryID(catID).subscribe(
      faqs => {
        this.faqs = faqs;
        this.showFaqs = true;
        this.loading = false;
        if (faqs.length === 0 && this.faq_subMenus.length === 0) {
          this.noResult = true;
        }
      },
      error => {
        this.loading = false;
        this.notificationBarCommunicationService.send_data(error);
      }
    );
  }

  getFAQs_ByParentCategory(parentId): void {
    this.faqsService
      .getSubMenus_ByParentCategory(parentId, this.lang)
      .subscribe(
        faq_subMenus => {
          this.faq_subMenus = faq_subMenus;
          this.getFAQs_ByCategoryID(parentId);
        },
        error => {
          this.loading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  loadFAQs(): void {
    this.faqs = [];
    this.faq_subMenus = [];
    this.showFaqs = false;
    this.loading = true;
    this.faqCategoriesService.getFAQParentCategories(this.lang).subscribe(
      categories => {
        this.parent_categories = categories;
        if (!this.faq_slug) {
          if (this.selected_cat_slug) {
            let matched = false;
            for (let i = 0; i < categories.length; i++) {
              if (categories[i].slug === this.selected_cat_slug) {
                this.selected_category = categories[i];
                this.selected_cat_index = i;
                matched = true;
              }
            }
            if (matched) {
              this.getFAQs_ByParentCategory(this.selected_category.id);
              this.exist_category = true;
            } else {
              this.pageNotFound = true;
            }
          } else {
            this.selected_category = categories[0];
            this.getFAQs_ByParentCategory(this.selected_category.id);
            this.exist_category = true;
          }
        }
      },
      error => {
        this.loading = false;
        this.notificationBarCommunicationService.send_data(error);
      }
    );
  }

  getFAQParentCategories(): void {
    this.faqs = [];
    this.faq_subMenus = [];
    this.showFaqs = false;
    this.loading = true;
    this.faqCategoriesService.getFAQParentCategories(this.lang).subscribe(
      categories => {
        this.parent_categories = categories;
      },
      error => {
        this.loading = false;
        this.notificationBarCommunicationService.send_data(error);
      }
    );
  }

  getFAQs_BySlug(): void {
    this.loading = true;
    this.faqsService.getFAQs_BySlug(this.faq_slug, this.lang).subscribe(
      faq => {
        this.selected_faq = faq;
        this.show_single_view = true;
        this.exist_category = true;
        this.loading = false;
        const self = this;
        const timer = setInterval(function() {
          if (self.selected_faq_el) {
            clearInterval(timer);
            self.expandElement(self.selected_faq_el.nativeElement);
          }
        }, 100);
      },
      error => {
        this.loading = false;
        this.notificationBarCommunicationService.send_data(error);
      }
    );
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
    this.paramsSubscription3 = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.faq_slug = params["slug"];
        if (this.faq_slug) {
          this.selected_cat_index = null;
          this.getFAQs_BySlug();
          this.loadFAQs();
        } else {
          this.selected_cat_index = null;
          this.getFAQs_BySlug();
          this.loadFAQs();
        }
      }
    );
    if (!this.faq_slug) {
      this.paramsSubscription2 = this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.selected_cat_slug = params["category"];
          if (
            this.selected_cat_slug === "undefined" ||
            typeof this.selected_cat_slug === "undefined"
          ) {
            this.getFAQParentCategories();
            this.exist_category = true;
          } else {
            if (
              this.searchTerm === "undefined" ||
              typeof this.searchTerm === "undefined"
            ) {
              this.show_single_view = true;
              this.loadFAQs();
            }
          }
        }
      );

      this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(
        (params: Params) => {
          this.searchTerm = params["q"];
          if (
            this.searchTerm !== "undefined" &&
            typeof this.searchTerm !== "undefined"
          ) {
            if (
              this.selected_cat_slug === "undefined" ||
              typeof this.selected_cat_slug === "undefined"
            ) {
              this.show_single_view = true;
              this.searchFAQs();
            } else {
              this.show_single_view = true;
              this.loadFAQs();
            }
          } else {
            if (
              this.selected_cat_slug !== "undefined" &&
              typeof this.selected_cat_slug !== "undefined"
            ) {
              this.show_single_view = true;
              this.loadFAQs();
            } else {
              this.show_single_view = false;
              this.loadFAQs();
            }
          }
        }
      );
    }

    const self = this;
    const timer = setInterval(function() {
      if (self.searchField) {
        clearInterval(timer);
        self.renderer.listen(self.searchField.nativeElement, "search", () => {
          if (self.searchTerm === "") {
            if (
              this.selected_cat_slug !== "undefined" &&
              typeof this.selected_cat_slug !== "undefined"
            ) {
              if (self.lang === "sv") {
                self.router.navigate(["/sv/help"]);
              } else {
                self.router.navigate(["/en/help"]);
              }
            } else {
              if (self.lang === "sv") {
                self.location.go("/sv/help");
              } else {
                self.location.go("/en/help");
              }
              self.show_single_view = false;
              self.router.navigate(["/en/help"]);
              if (self.lang === "sv") {
                self.router.navigate(["/sv/help"]);
              } else {
                self.router.navigate(["/en/help"]);
              }
            }
          }
        });
      } else if (self.pageNotFound) {
        clearInterval(timer);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.paramsSubscription2) {
      this.paramsSubscription2.unsubscribe();
    }
    if (this.paramsSubscription3) {
      this.paramsSubscription3.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
