import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { Archive, ArchiveCategory, Document } from '../../interfaces/archive';
import { CookieService } from 'ngx-cookie';

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

  searchDocuments(searchTerm: string, categoryID: number, date_filter: string): Observable<Archive[]> {
    console.log(searchTerm);
    let params = '';
    if (categoryID !== 0) {
      params = '&categories=' + categoryID;
    }
    return this.http
        .get(this.config.ARCHIVE_URL + '?search=' + searchTerm + params + '&after=' + date_filter + 'T22:26:53')
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
        documents: this.castDataToDocumentType(c.acf.documents),
        categories: this.castDataToArchiveCategoryType(c.pure_taxonomies.categories),
      });
    });
    return archives;
  }

  castDataToDocumentType(data) {
    const documents: Document[] = [];
    console.log(data);
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

  castDataToArchiveCategoryType(data) {
    const categories: ArchiveCategory[] = [];
    console.log(data);
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
    const term = filename.substring(filename.length - 4, filename.length);
    console.log(filename);
    console.log(term);
    if (term === '.zip') {
      type = 'zip';
    }else if (term === '.pdf') {
      type = 'pdf';
    }else if (term === 'docx') {
      type = 'docx';
    }
    return type;
  }

}
