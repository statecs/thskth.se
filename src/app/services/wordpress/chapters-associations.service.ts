import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { Association, Chapter } from '../../interfaces/chapters_associations';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class ChaptersAssociationsService {
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

    getAssociations(): Observable<Association[]> {
        return this.http
            .get(this.config.ASSOCIATION_URL + '?per_page=100&_embed')
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_AssociationType(res); });
    }

    searchAssociations(searchTerm: string): Observable<Association[]> {
        return this.http
            .get(this.config.ASSOCIATION_URL + '?per_page=100&_embed&search=' + searchTerm)
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_AssociationType(res); });
    }

    castPostsTo_AssociationType(data: any) {
        const associations: Association[] = [];
        data.forEach(c => {
            let image = '';
            if (c._embedded['wp:featuredmedia']) {
                image = c._embedded['wp:featuredmedia'][0].source_url;
            }
            associations.push({
                title: c.title.rendered,
                description: c.content.rendered,
                image: image,
                category: c.pure_taxonomies.ths_associations[0].name,
                contact: {
                    name: c.acf.name,
                    title: c.acf.title,
                    email: c.acf.email,
                    phone: c.acf.phone,
                    website: c.acf.website,
                    website2: c.acf.website_2,
                }
            });
        });
        return associations;
    }

    getChapters(): Observable<Chapter[]> {
        return this.http
            .get(this.config.CHAPTER_URL + '?per_page=100&_embed')
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_ChapterType(res); });
    }

    searchChapters(searchTerm: string): Observable<Chapter[]> {
        return this.http
            .get(this.config.CHAPTER_URL + '?per_page=100&_embed&search=' + searchTerm)
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_ChapterType(res); });
    }

    castPostsTo_ChapterType(data: any) {
        const chapters: Chapter[] = [];
        data.forEach(c => {
            let image = '';
            if (c._embedded) {
                image = c._embedded['wp:featuredmedia'][0].source_url;
            }
            chapters.push({
                title: c.title.rendered,
                description: c.content.rendered,
                year: c.acf.year,
                website: c.acf.website_url,
                section_local: c.acf.section_local,
                image: image,
            });
        });
        return chapters;
    }

}