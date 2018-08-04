import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataFetcherService} from '../utility/data-fetcher.service';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import {SearchParams} from '../../interfaces-and-classes/archive';

export abstract class WordpressBaseDataService<T extends BaseDataInterface> {
    private data: BehaviorSubject<T[]> = new BehaviorSubject(null);
    private fetched = false;
    private params: string;

    constructor(protected dataFetcherService: DataFetcherService,
                protected endpoint: string = '') {
    }

    getData(endpointExtension: string = '', params: string = ''): Observable<T[]> {
        if (params) {
            this.params = params;
        }
        if (endpointExtension && this.endpoint !== '') {
            this.endpoint += endpointExtension[0] === '/' ? endpointExtension : '/' + endpointExtension;
        }else if (this.endpoint === '' ) {
            this.endpoint = endpointExtension;
        }

        if (!this.fetched) {
            this.fetched = true;
            this.fetchData(this.endpoint + '?' + params);
        }

        return this.data.filter(data => {
            return data != null;
        });
    }

    private fetchData(url: string) {
        this.dataFetcherService.get(url).subscribe(
            (values) => {
                this.data.next(this.mapItems(values));
            }
        );
    }

    getDataByURL( query: string = '', url: string = null ): Observable<T[]> {
        return this.dataFetcherService.get((url ? url : this.endpoint) + '?' + query)
            .map((values) => {
                    return this.mapItems(values);
                }
            );
    }

    getDataById( query: string = '', url: string = null ): Observable<T[]> {
        return this.dataFetcherService.get((url ? url : this.endpoint) + '?' + query)
            .map((values) => {
                    return this.mapItems(values);
                }
            );
    }

    getDataBySlug( query: string = '', url: string = null ): Observable<T[]> {
        return this.dataFetcherService.get((url ? url : this.endpoint) + '?' + query)
            .map((values) => {
                return this.mapItems(values);
            }
        );
    }

    searchData( query: string = '', url: string = null ) {
        return this.dataFetcherService.get((url ? url : this.endpoint) + '?' + query)
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
