import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import {
  Archive,
  ArchiveCategory,
  Document,
  SearchParams
} from "../../interfaces-and-classes/archive";
import { CookieService } from "ngx-cookie";
import * as format from "date-fns/format";
import { DataFetcherService } from "../utility/data-fetcher.service";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import {Post} from '../../interfaces-and-classes/post';
import { SearchResult } from "../../interfaces-and-classes/search";

@Injectable()
export class ArchiveService extends WordpressBaseDataService<Archive> {
  protected config: AppConfig;
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).ARCHIVE_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getArchiveBySlug(slug: string, lang: string): Observable<Archive> {
    this.language = lang;
    return (
      this.getDataBySlug("_embed&slug=" + slug + "&lang=" + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return this.castPostsTo_SearchResultType(res)[0];
        })
    );
  }

  getDocuments(amount, lang: string): Observable<Archive[]> {
    this.language = lang;
    return (
      this.getData(null, "_embed&per_page=" + amount + "&lang=" + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return this.castPostsTo_SearchResultType(res);
        })
    );
  }

  getDocumentsBySinceDateTime(amount, lang: string, sinceDateTime: string): Observable<Archive[]> {
      this.language = lang;
      return (
          this.getData(null, "_embed&per_page=" + amount + '&before=' + sinceDateTime + "&lang=" + this.language)
          // Cast response data to FAQ Category type
          .map((res: any) => {
              return this.castPostsTo_SearchResultType(res);
          })
      );

  searchDocumentsPage(
    search_term: string,
    amount: number,
    lang: string
  ): Observable<SearchResult[]> {
    this.language = lang;
    return (
      this.searchData(
        "order=asc&per_page=" +
          amount +
          "&search=" +
          search_term +
          "&lang=" +
          this.language
      )
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => {
          return SearchResult.convertDocumentsToSearchResultType(res);
        })
    );

  }

  searchDocuments(
    searchParams: SearchParams,
    lang: string
  ): Observable<Archive[]> {
    this.language = lang;
    let params = "";
    if (searchParams.categoryID !== 0) {
      params = "&categories=" + searchParams.categoryID;
    }
    return (
      this.searchData(
        "_embed&search=" +
          searchParams.searchTerm +
          params +
          "&after=" +
          searchParams.start_date +
          "T00:00:00" +
          "&before=" +
          searchParams.end_date +
          "T23:59:00" +
          "&lang=" +
          this.language
      )
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return this.castPostsTo_SearchResultType(res);
        })
    );
  }

  castPostsTo_SearchResultType(data: any) {
    const archives: Archive[] = [];
    data.forEach(c => {
        let categories: any[] = [];
        if (c.pure_taxonomies && c.pure_taxonomies.categories) {
            categories = c.pure_taxonomies.categories;
        }
      archives.push({
        id: c.id,
        slug: c.slug,
        title: c.title.rendered,
        published: this.formatDate(c.date),
        lastModified: this.formatDate(c.modified),
        description: c.content.rendered,
        documents: this.castDataToDocumentType(c.acf.documents),
        categories: this.castDataToArchiveCategoryType(
            categories
        ),
        author: {
          name: c["_embedded"].author[0].name,
          avatar_url: c["_embedded"].author[0].avatar_urls["96"]
        },
        date: c.date,
      });
    });
    return archives;
  }

  formatDate(date: any): string {
    return format(date, "DD MMM YYYY");
  }

  castDataToDocumentType(data): Document[] {
    const documents: Document[] = [];
    if (data) {
      data.forEach(d => {
        documents.push({
          title: d.documents.title,
          filename: d.documents.filename,
          url: d.documents.url,
          icon: d.documents.icon,
          mime_type: this.getMimeType(d.documents.filename)
        });
      });
    }
    return documents;
  }

  castDataToArchiveCategoryType(data): ArchiveCategory[] {
    const categories: ArchiveCategory[] = [];
    data.forEach(c => {
      categories.push({
        id: c.term_id,
        name: c.name,
        slug: c.slug
      });
    });
    return categories;
  }

  getMimeType(filename: string) {
    let type = "";
    if (filename) {
      const term = filename.substring(filename.length - 4, filename.length);
      if (term === ".zip") {
        type = "zip";
      } else if (term === ".pdf") {
        type = "pdf";
      } else if (term === "docx") {
        type = "docx";
      }
    }
    return type;
  }
}
