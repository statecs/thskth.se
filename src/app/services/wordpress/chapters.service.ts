import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import {Chapter} from '../../interfaces-and-classes/chapters_associations';
import { CookieService } from 'ngx-cookie';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';
import {DataFetcherService} from '../utility/data-fetcher.service';

@Injectable()
export class ChaptersService extends WordpressBaseDataService<Chapter> {
    protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).CHAPTER_URL);

        if (typeof this._cookieService.get('language') === 'undefined') {
            this.language = 'en';
        }else {
            this.language = this._cookieService.get('language');
        }
    }

    getChapterBySlug(slug, lang: string): Observable<Chapter[]> {
        return this.getDataBySlug('slug=' + slug + '&_embed' + '&lang=' + lang)
        // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_ChapterType(res); });
    }

    getChapters(lang: string): Observable<Chapter[]> {
        return this.getData(null, '?per_page=100&_embed' + '&lang=' + lang)
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_ChapterType(res); });
    }

    searchChapters(searchTerm: string, lang: string): Observable<Chapter[]> {
        return this.searchData('?per_page=100&_embed&search=' + searchTerm + '&lang=' + lang)
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
                id: c.id,
                title: c.title.rendered,
                description: c.content.rendered,
                year: c.acf.year,
                website: c.acf.website_url,
                section_local: c.acf.section_local,
                slug: c.slug,
                header_slides: [
                    {
                        imageUrl: image
                    }
                ]
            });
        });
        return chapters;
    }

}
