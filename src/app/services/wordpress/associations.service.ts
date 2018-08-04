import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import {Association, HeaderSlide} from '../../interfaces-and-classes/chapters_associations';
import { CookieService } from 'ngx-cookie';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';
import {Archive} from '../../interfaces-and-classes/archive';
import {DataFetcherService} from '../utility/data-fetcher.service';

@Injectable()
export class AssociationsService extends WordpressBaseDataService<Archive> {
    protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).ASSOCIATION_URL);

        if (typeof this._cookieService.get('language') === 'undefined') {
            this.language = 'en';
        }else {
            this.language = this._cookieService.get('language');
        }
    }
    getAssociationBySlug(slug, lang: string): Observable<Association[]> {
        return this.getDataBySlug('slug=' + slug + '&_embed' + '&lang=' + lang)
        // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_AssociationType(res); });
    }

    getAssociations(lang: string): Observable<Association[]> {
        return this.getData('?per_page=100&_embed' + '&lang=' + lang)
        // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_AssociationType(res); });
    }

    searchAssociations(searchTerm: string, lang: string): Observable<Association[]> {
        return this.searchData('?per_page=100&_embed&search=' + searchTerm + '&lang=' + lang)
            // Cast response data to FAQ Category type
            .map((res: any) => { return this.castPostsTo_AssociationType(res); });
    }

    castPostsTo_AssociationType(data: any) {
        const associations: Association[] = [];
        data.forEach(c => {
            associations.push({
                title: c.title.rendered,
                description: c.content.rendered,
                category: c.pure_taxonomies.ths_associations[0].name,
                contact: {
                    name: c.acf.name,
                    title: c.acf.title,
                    email: c.acf.email,
                    phone: c.acf.phone,
                    website: c.acf.website,
                    website2: c.acf.website_2,
                },
                slug: c.slug,
                header_slides: this.getHeaderSlides(c.acf.slides)
            });
        });
        return associations;
    }

    getHeaderSlides(data: any) {
        const slides: HeaderSlide[] = [];
        if (data) {
            data.forEach(s => {
                slides.push({
                    imageUrl: s.image.url
                });
            });
        }
        return slides;
    }
}
