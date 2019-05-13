import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchMenubarCommunicationService } from "../../services/component-communicators/search-menubar-communication.service";
import { SearchResult } from "../../interfaces-and-classes/search";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";
import { Subscription } from "rxjs/Subscription";
import { CookieService } from "ngx-cookie";
import { PostsService } from "../../services/wordpress/posts.service";
import { PagesService } from "../../services/wordpress/pages.service";
import { FaqsService } from "../../services/wordpress/faqs.service";
import { AddLangToSlugPipe } from "../../pipes/add-lang-to-slug.pipe";
import { ArchiveService } from "../../services/wordpress/archive.service";
import { RemoveLangParamPipe } from "../../pipes/remove-lang-param.pipe";

@Component({
  selector: "app-search-menubar",
  templateUrl: "./search-menubar.component.html",
  styleUrls: ["./search-menubar.component.scss"]
})
export class SearchMenubarComponent implements OnInit, OnDestroy {
  public mostSearchTerms: string[];
  public showSearchBar: boolean;
  public pageResults: SearchResult[];
  public postsResults: SearchResult[];
  public faqResults: SearchResult[];
  public documentResultsSearch: SearchResult[];
  public postsLoading: boolean;
  public pagesLoading: boolean;
  public faqsLoading: boolean;
  public documentLoading: boolean;
  public searchTerm: string;
  public showResultsDropdown: boolean;
  private lang: string;
  public paramsSubscription: Subscription;
  public postSubscription: Subscription;
  public pageSubscription: Subscription;
  public faqsSubscription: Subscription;
  private addLangToSlugPipe: AddLangToSlugPipe;
  private removeLangParamPipe: RemoveLangParamPipe;
  public documentsSubscription: Subscription;
  public menuBarSubscription: Subscription;

  constructor(
    private searchMenubarCommunicationService: SearchMenubarCommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationBarCommunicationService: NotificationBarCommunicationService,
    private _cookieService: CookieService,
    private postsService: PostsService,
    private pagesService: PagesService,
    private faqsService: FaqsService,
    private archiveService: ArchiveService
  ) {
    this.mostSearchTerms = [
      "Membership",
      "THS card",
      "Career",
      "Student",
      "Contact",
      "News"
    ];
    this.showSearchBar = false;
    this.showResultsDropdown = false;
    this.pageResults = [];
    this.postsResults = [];
    this.faqResults = [];
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
  }

  goToPage(link, type): void {
    this.hideBar();
    if (type === "document") {
      this.router.navigate([this.lang + "/documents/" + link]);
    }
    if (type === "faq") {
      this.router.navigate([this.lang + "/help/faqs/" + link]);
    }
    if (type === "post") {
      this.router.navigate([this.lang + "/news/" + link]);
    }
    /*  if (type === "page") {
      this.router.navigate(["/" + link]);
    }*/

    if (type === "page") {
      let slug = link;
      if (
        slug.substring(slug.length - 9) === "/?lang=en" ||
        slug.substring(slug.length - 9) === "/?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      if (
        slug.substring(slug.length - 8) === "?lang=en" ||
        slug.substring(slug.length - 8) === "?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }
  }

  goToSearchPage(): void {
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
    this.hideBar();
    let slug = "";
    if (this.lang === "sv") {
      slug = "sv/search";
    } else {
      slug = "en/search";
    }
    this.router.navigate([slug], { queryParams: { q: this.searchTerm } });
  }

  showBar(): void {
    this.showSearchBar = true;
    this.searchPosts();
    this.searchPages();
    this.searchFAQs();
    this.searchDocuments();
  }

  closeBar(): void {
    this.hideBar();
  }

  hideBar(): void {
    this.showSearchBar = false;
  }

  liveSearch(): void {
    if (this.searchTerm !== "") {
      this.searchPosts();
      this.searchPages();
      this.searchFAQs();
      this.searchDocuments();
      this.showResultsDropdown = true;
      this._cookieService.put("search-menubar-terms", this.searchTerm);
    } else {
      this.showResultsDropdown = false;
    }
  }

  replaceLineBreak(s: string) {
    return s && s.replace(/<[^>]+>/gm, "");
  }
  searchPosts(): void {
    this.postSubscription = this.postsService
      .searchPosts(this.searchTerm, 2, this.lang)
      .subscribe(
        res => {
          this.postsLoading = false;
          this.postsResults = res;
        },
        error => {
          this.postsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  searchPages(): void {
    this.pageSubscription = this.pagesService
      .searchPages(this.searchTerm, 2, this.lang)
      .subscribe(
        res => {
          this.pagesLoading = false;
          this.pageResults = res;
        },
        error => {
          this.pagesLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  searchFAQs(): void {
    this.faqsSubscription = this.faqsService
      .searchFAQs(this.searchTerm, 2, this.lang)
      .subscribe(
        res => {
          this.faqsLoading = false;
          this.faqResults = res;
        },
        error => {
          this.faqsLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  searchDocuments(): void {
    this.documentsSubscription = this.archiveService
      .searchDocumentsPage(this.searchTerm, 2, this.lang)
      .subscribe(
        res => {
          this.documentLoading = false;
          this.documentResultsSearch = res;
        },
        error => {
          this.documentLoading = false;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.menuBarSubscription = this.searchMenubarCommunicationService.notifyObservable$.subscribe(
      () => {
        if (this._cookieService.get("language") == "sv") {
          this.lang = "sv";
        } else {
          this.lang = "en";
        }
        this.showBar();
        const search_term = this._cookieService.get("search-menubar-terms");
        if (search_term) {
          this.searchTerm = search_term;
          this.liveSearch();
        } else {
          this.searchTerm = "";
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.documentsSubscription) {
      this.documentsSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.faqsSubscription) {
      this.faqsSubscription.unsubscribe();
    }
    if (this.menuBarSubscription) {
      this.menuBarSubscription.unsubscribe();
    }
  }
}
