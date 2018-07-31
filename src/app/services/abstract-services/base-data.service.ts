import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataFetcherService} from '../utility/data-fetcher.service';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

export abstract class BaseDataService<T extends BaseDataInterface> {
    private data: BehaviorSubject<T[]> = new BehaviorSubject(null);
    private fetched = false;
    private params: URLSearchParams = new URLSearchParams();

    constructor(protected dataFetcherService: DataFetcherService,
                protected endpoint: string = '') {
    }

    getData(endpointExtension: string = '', params: URLSearchParams = null): Observable<T[]> {
        if (params) {
            this.params = params;
        }
        if (endpointExtension && this.endpoint !== '') {
            this.endpoint += endpointExtension[0] === '/' ? endpointExtension : '/' + endpointExtension;
        }

        if (!this.fetched) {
            this.fetched = true;
            this.fetchData();
        }

        return this.data.filter(data => {
            return data != null;
        });
    }

    private fetchData() {
        this.dataFetcherService.get(this.endpoint, this.params).subscribe(
            (values) => {
                this.data.next(this.mapItems(values));
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
