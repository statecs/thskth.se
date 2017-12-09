import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import {Archive, ArchiveCategory, Document, SearchParams} from '../../interfaces/archive';
import { CookieService } from 'ngx-cookie';
import format from 'date-fns/format/index';

@Injectable()
export class ArchiveService {
  protected config: AppConfig;
  protected language: string;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getArchiveBySlug(slug: string, lang: string): Observable<Archive> {
    this.language = lang;
    return this.http
        .get(this.config.ARCHIVE_URL + '?_embed&slug=' + slug + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res)[0]; });
  }

  getDocuments(amount, lang: string): Observable<Archive[]> {
    this.language = lang;
    return this.http
        .get(this.config.ARCHIVE_URL + '?_embed&per_page=' + amount + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }

  searchDocuments(searchParams: SearchParams, lang: string): Observable<Archive[]> {
    console.log("test");
    this.language = lang;
    let params = '';
    if (searchParams.categoryID !== 0) {
      params = '&categories=' + searchParams.categoryID;
    }
    return this.http
        .get(this.config.ARCHIVE_URL + '?_embed&search=' + searchParams.searchTerm + params + '&after=' + searchParams.start_date + 'T00:00:00' + '&before=' + searchParams.end_date + 'T23:59:00' + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }

  castPostsTo_SearchResultType(data: any) {
    const archives: Archive[] = [];
    data.forEach(c => {
      archives.push({
        slug: c.slug,
        title: c.title.rendered,
        published: this.formatDate(c.date),
        lastModified: this.formatDate(c.modified),
        description: c.content.rendered,
        documents: this.castDataToDocumentType(c.acf.documents),
        categories: this.castDataToArchiveCategoryType(c.pure_taxonomies.categories),
        author: {
          name: c['_embedded'].author[0].name,
          avatar_url: c['_embedded'].author[0].avatar_urls['96']
        }
      });
    });
    return archives;
  }

  formatDate(date: any): string {
    return format(date, 'DD MMM YYYY');
  }

  castDataToDocumentType(data): Document[] {
    const documents: Document[] = [];
    data.forEach(d => {
      documents.push({
        title: d.documents.title,
        filename: d.documents.filename,
        url: d.documents.url,
        icon: d.documents.icon,
        mime_type: this.getMimeType(d.documents.filename),
      });
    });
    return documents;
  }

  castDataToArchiveCategoryType(data): ArchiveCategory[] {
    const categories: ArchiveCategory[] = [];
    data.forEach(c => {
      categories.push({
        id: c.term_id,
        name: c.name,
        slug: c.slug,
      });
    });
    return categories;
  }

  getMimeType(filename: string) {
    let type = '';
    if (filename) {
      const term = filename.substring(filename.length - 4, filename.length);
      if (term === '.zip') {
        type = 'zip';
      }else if (term === '.pdf') {
        type = 'pdf';
      }else if (term === 'docx') {
        type = 'docx';
      }
    }
    return type;
  }

}
