import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataFetcherService} from '../utility/data-fetcher.service';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import {SearchParams} from '../../interfaces-and-classes/archive';

export abstract class WordpressBaseDataService<T extends BaseDataInterface> {
    private data: BehaviorSubject<T[]> = new BehaviorSubject(null);
    private fetched = false;
    private params: URLSearchParams = new URLSearchParams();

    constructor(protected dataFetcherService: DataFetcherService,
                protected endpoint: string = '') {
    }

    getData(query: string = '', params: URLSearchParams = null): Observable<T[]> {
        if (params) {
            this.params = params;
        }

        if (!this.fetched) {
            this.fetched = true;
            this.fetchData(this.endpoint + '?' + query);
        }

        return this.data.filter(data => {
            return data != null;
        });
    }

    private fetchData(url: string) {
        this.dataFetcherService.get(url, this.params).subscribe(
            (values) => {
                this.data.next(this.mapItems(values));
            }
        );
    }

    getDataBySlug(query: string): Observable<T[]> {
        return this.dataFetcherService.get(this.endpoint + '?' + query)
            .map((values) => {
                return this.mapItems(values);
            }
        );
    }

    searchData(query: string) {
        return this.dataFetcherService.get(this.endpoint + '?' + query)
            .map((values) => {
                    return this.mapItems(values);
                }
            );
    }

    private mapItems(objects: any[]): T[] {
        return _.map(objects, (obj) => this.mapItem(obj));
    }

    protected mapItem(obj: any): T {
        return obj;
    }
}

export interface BaseDataInterface {
    id: number;
}
